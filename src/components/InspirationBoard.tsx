import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

/* ── Inspiration data ─────────────────────────────────────── */

interface InspirationItem {
  id: number;
  type: "tv" | "corkboard" | "notebook" | "magazine";
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  worldX: number;
  worldY: number;
}

const ITEMS: InspirationItem[] = [
  { id: 1, type: "tv", title: "Alpine Light", content: "Mountain photography — chasing light at altitude.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", url: "https://unsplash.com", worldX: 2.5, worldY: 1.5 },
  { id: 2, type: "tv", title: "Color Theory", content: "Exploring gradients and natural palettes.", imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=300&fit=crop", url: "https://unsplash.com", worldX: 5.5, worldY: 1.5 },
  { id: 3, type: "tv", title: "Street Typography", content: "Found type in urban environments.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", url: "https://unsplash.com", worldX: 8.5, worldY: 1.5 },
  { id: 4, type: "corkboard", title: "Steve Jobs", content: "\"Design is not just what it looks like. Design is how it works.\"", worldX: 1.5, worldY: 5.5 },
  { id: 5, type: "corkboard", title: "Leonardo da Vinci", content: "\"Simplicity is the ultimate sophistication.\"", worldX: 9.5, worldY: 5.5 },
  { id: 6, type: "notebook", title: "Personal Note", content: "Explore brutalist web aesthetics — raw, honest, confrontational design.", worldX: 5.5, worldY: 9.5 },
  { id: 7, type: "magazine", title: "Wired", content: "The Future of Creative Tools", url: "https://wired.com", worldX: 1.5, worldY: 8.5 },
  { id: 8, type: "magazine", title: "It's Nice That", content: "Why Brutalism is Making a Comeback", url: "https://itsnicethat.com", worldX: 9.5, worldY: 8.5 },
];

/* ── Map (11×11, 1=wall) ─────────────────────────────────── */

const MAP: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1],
];

const MAP_W = MAP[0].length;
const MAP_H = MAP.length;
const TILE = 1; // each tile is 1 unit
const FOV = Math.PI / 3; // 60°
const INTERACT_DIST = 2.0;
const ACCENT = "#c8d7df";
const HIGHLIGHT = "#d4f979";
const MOVE_SPEED = 0.04;
const ROT_SPEED = 0.035;

/* ── Component ────────────────────────────────────────────── */

const InspirationBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<InspirationItem | null>(null);
  const [nearbyItem, setNearbyItem] = useState<InspirationItem | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const playerRef = useRef({ x: 5.5, y: 5.5, angle: -Math.PI / 2 });
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const animFrameRef = useRef<number>(0);
  const canvasFocusedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const padding = useTransform(scrollYProgress, [0, 0.12, 0.25, 0.70, 0.82, 1], [24, 24, 0, 0, 24, 24]);

  // Preload images
  useEffect(() => {
    ITEMS.forEach((item) => {
      if (item.imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = item.imageUrl;
        imagesRef.current.set(item.id, img);
      }
    });
  }, []);

  // Key handlers
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === "e" || e.key === "E") {
        if (nearbyItem) setActiveItem(nearbyItem);
      }
      if (e.key === "Escape") setActiveItem(null);
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [nearbyItem]);

  // Helper: check wall collision
  const isWall = useCallback((x: number, y: number): boolean => {
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if (mx < 0 || mx >= MAP_W || my < 0 || my >= MAP_H) return true;
    return MAP[my][mx] === 1;
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resizeObserver: ResizeObserver;
    let cw = 0, ch = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      cw = Math.floor(rect.width);
      ch = Math.floor(rect.height);
      canvas.width = cw;
      canvas.height = ch;
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement!);
    resize();

    const castRay = (angle: number): { dist: number; hitX: number; side: number } => {
      const p = playerRef.current;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      let t = 0;
      const step = 0.02;
      while (t < 20) {
        t += step;
        const x = p.x + cos * t;
        const y = p.y + sin * t;
        if (isWall(x, y)) {
          // Determine which side was hit for shading
          const prevX = p.x + cos * (t - step);
          const prevY = p.y + sin * (t - step);
          const cellX = Math.floor(x);
          const cellY = Math.floor(y);
          const prevCellX = Math.floor(prevX);
          const prevCellY = Math.floor(prevY);
          let side = 0;
          let hitX = 0;
          if (prevCellX !== cellX) {
            side = 0; // vertical wall
            hitX = (p.y + sin * t) % 1;
          } else if (prevCellY !== cellY) {
            side = 1; // horizontal wall
            hitX = (p.x + cos * t) % 1;
          }
          return { dist: t, hitX, side };
        }
      }
      return { dist: 20, hitX: 0, side: 0 };
    };

    const drawFrame = () => {
      const p = playerRef.current;
      const keys = keysRef.current;

      // Update player
      if (!activeItem) {
        let dx = 0, dy = 0;
        if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) {
          dx += Math.cos(p.angle) * MOVE_SPEED;
          dy += Math.sin(p.angle) * MOVE_SPEED;
        }
        if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) {
          dx -= Math.cos(p.angle) * MOVE_SPEED;
          dy -= Math.sin(p.angle) * MOVE_SPEED;
        }
        if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) {
          p.angle -= ROT_SPEED;
        }
        if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) {
          p.angle += ROT_SPEED;
        }

        // Collision — try x and y separately
        const margin = 0.2;
        if (!isWall(p.x + dx + (dx > 0 ? margin : -margin), p.y)) p.x += dx;
        if (!isWall(p.x, p.y + dy + (dy > 0 ? margin : -margin))) p.y += dy;
      }

      // Find nearby item
      let closest: InspirationItem | null = null;
      let closestDist = INTERACT_DIST;
      for (const item of ITEMS) {
        const d = Math.hypot(item.worldX - p.x, item.worldY - p.y);
        if (d < closestDist) {
          // Check if roughly facing the item
          const angleToItem = Math.atan2(item.worldY - p.y, item.worldX - p.x);
          let diff = angleToItem - p.angle;
          while (diff > Math.PI) diff -= 2 * Math.PI;
          while (diff < -Math.PI) diff += 2 * Math.PI;
          if (Math.abs(diff) < Math.PI / 2.5) {
            closestDist = d;
            closest = item;
          }
        }
      }
      setNearbyItem(closest);

      if (cw === 0 || ch === 0) {
        animFrameRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      // Clear
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      // Raycasting — render walls
      const numRays = Math.min(cw, 400); // limit rays for performance
      const stripW = cw / numRays;
      const zBuffer: number[] = [];

      for (let i = 0; i < numRays; i++) {
        const rayAngle = p.angle - FOV / 2 + (i / numRays) * FOV;
        const { dist, side } = castRay(rayAngle);

        // Fisheye correction
        const corrDist = dist * Math.cos(rayAngle - p.angle);
        zBuffer[i] = corrDist;

        // Wall height
        const wallH = Math.min(ch * 2, ch / corrDist);
        const wallTop = (ch - wallH) / 2;

        // Wall color — white lines on dark, darker for side=1
        const brightness = side === 0 ? 0.7 : 0.5;
        const fade = Math.max(0, 1 - corrDist / 12);
        const val = Math.floor(brightness * fade * 255);
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(i * stripW, wallTop, stripW + 1, wallH);

        // Floor shading
        ctx.fillStyle = `rgba(30,30,25,1)`;
        ctx.fillRect(i * stripW, wallTop + wallH, stripW + 1, ch - wallTop - wallH);

        // Ceiling — dark
        ctx.fillStyle = `rgba(10,10,8,1)`;
        ctx.fillRect(i * stripW, 0, stripW + 1, wallTop);
      }

      // Render sprites (items)
      const sprites = ITEMS.map((item) => {
        const dx = item.worldX - p.x;
        const dy = item.worldY - p.y;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        let diff = angle - p.angle;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        return { item, dist, diff };
      })
        .filter((s) => s.dist > 0.3 && Math.abs(s.diff) < FOV / 2 + 0.2)
        .sort((a, b) => b.dist - a.dist); // draw far first

      for (const { item, dist, diff } of sprites) {
        const corrDist = dist * Math.cos(diff);
        if (corrDist < 0.1) continue;

        const spriteScreenX = cw / 2 + (diff / (FOV / 2)) * (cw / 2);
        const spriteH = Math.min(ch * 1.5, (ch * 0.6) / corrDist);
        const spriteW = spriteH * 0.8;
        const spriteTop = (ch - spriteH) / 2;
        const spriteLeft = spriteScreenX - spriteW / 2;

        // Z-buffer check — only draw columns not occluded by walls
        const startCol = Math.max(0, Math.floor(spriteLeft / stripW));
        const endCol = Math.min(numRays - 1, Math.floor((spriteLeft + spriteW) / stripW));

        let visible = false;
        for (let c = startCol; c <= endCol; c++) {
          if (zBuffer[c] > corrDist) visible = true;
        }
        if (!visible) continue;

        const fade = Math.max(0, Math.min(1, 1 - corrDist / 10));
        const isNearby = closest?.id === item.id;

        if (item.type === "tv") {
          // CRT TV
          const tvImg = imagesRef.current.get(item.id);

          // TV body
          ctx.fillStyle = `rgba(40,40,35,${fade})`;
          ctx.fillRect(spriteLeft, spriteTop, spriteW, spriteH);

          // Screen area
          const screenPad = spriteW * 0.1;
          const screenX = spriteLeft + screenPad;
          const screenY = spriteTop + screenPad;
          const screenW = spriteW - screenPad * 2;
          const screenH = spriteH * 0.65;

          if (tvImg && tvImg.complete && tvImg.naturalWidth > 0) {
            ctx.drawImage(tvImg, screenX, screenY, screenW, screenH);
            // Scanlines
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            for (let sl = 0; sl < screenH; sl += 3) {
              ctx.fillRect(screenX, screenY + sl, screenW, 1);
            }
          } else {
            // Static noise
            ctx.fillStyle = "#111";
            ctx.fillRect(screenX, screenY, screenW, screenH);
            for (let n = 0; n < 40; n++) {
              const nx = screenX + Math.random() * screenW;
              const ny = screenY + Math.random() * screenH;
              const nv = Math.random() > 0.5 ? 200 : 40;
              ctx.fillStyle = `rgba(${nv},${nv},${nv},0.5)`;
              ctx.fillRect(nx, ny, 2, 2);
            }
          }

          // TV glow if nearby
          if (isNearby) {
            ctx.strokeStyle = ACCENT;
            ctx.lineWidth = 2;
            ctx.strokeRect(spriteLeft - 2, spriteTop - 2, spriteW + 4, spriteH + 4);
          }

          // Label
          ctx.fillStyle = `rgba(200,215,223,${fade * 0.8})`;
          ctx.font = `${Math.max(9, spriteW * 0.08)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(item.title, spriteLeft + spriteW / 2, spriteTop + spriteH - spriteH * 0.08);
        } else if (item.type === "corkboard") {
          // Corkboard
          ctx.fillStyle = `rgba(80,65,45,${fade * 0.8})`;
          ctx.fillRect(spriteLeft, spriteTop, spriteW, spriteH);
          ctx.strokeStyle = `rgba(200,200,180,${fade * 0.4})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(spriteLeft, spriteTop, spriteW, spriteH);

          // Pushpins
          const pinColors = [HIGHLIGHT, ACCENT, "#fff"];
          for (let pi = 0; pi < 3; pi++) {
            ctx.beginPath();
            ctx.arc(spriteLeft + spriteW * (0.2 + pi * 0.3), spriteTop + spriteH * 0.15, Math.max(2, spriteW * 0.03), 0, Math.PI * 2);
            ctx.fillStyle = pinColors[pi];
            ctx.fill();
          }

          // Quote text
          ctx.fillStyle = `rgba(255,255,255,${fade * 0.7})`;
          ctx.font = `${Math.max(8, spriteW * 0.07)}px monospace`;
          ctx.textAlign = "center";
          const maxChars = Math.floor(spriteW / 6);
          const lines = wrapText(item.content, maxChars);
          lines.slice(0, 4).forEach((line, li) => {
            ctx.fillText(line, spriteLeft + spriteW / 2, spriteTop + spriteH * 0.35 + li * (spriteH * 0.12));
          });

          // Author
          ctx.fillStyle = `rgba(200,215,223,${fade * 0.6})`;
          ctx.font = `${Math.max(7, spriteW * 0.06)}px monospace`;
          ctx.fillText(`— ${item.title}`, spriteLeft + spriteW / 2, spriteTop + spriteH * 0.85);

          if (isNearby) {
            ctx.strokeStyle = ACCENT;
            ctx.lineWidth = 2;
            ctx.strokeRect(spriteLeft - 2, spriteTop - 2, spriteW + 4, spriteH + 4);
          }
        } else if (item.type === "notebook") {
          // Notebook on desk
          ctx.fillStyle = `rgba(50,50,45,${fade * 0.8})`;
          ctx.fillRect(spriteLeft, spriteTop + spriteH * 0.3, spriteW, spriteH * 0.7);
          // Notebook
          ctx.fillStyle = `rgba(30,30,28,${fade})`;
          ctx.fillRect(spriteLeft + spriteW * 0.15, spriteTop + spriteH * 0.1, spriteW * 0.7, spriteH * 0.55);
          ctx.strokeStyle = `rgba(200,215,223,${fade * 0.3})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(spriteLeft + spriteW * 0.15, spriteTop + spriteH * 0.1, spriteW * 0.7, spriteH * 0.55);

          // Lines on notebook
          for (let li = 0; li < 4; li++) {
            ctx.strokeStyle = `rgba(200,215,223,${fade * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(spriteLeft + spriteW * 0.2, spriteTop + spriteH * (0.25 + li * 0.1));
            ctx.lineTo(spriteLeft + spriteW * 0.8, spriteTop + spriteH * (0.25 + li * 0.1));
            ctx.stroke();
          }

          ctx.fillStyle = `rgba(200,215,223,${fade * 0.6})`;
          ctx.font = `${Math.max(7, spriteW * 0.06)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(item.title, spriteLeft + spriteW / 2, spriteTop + spriteH * 0.9);

          if (isNearby) {
            ctx.strokeStyle = ACCENT;
            ctx.lineWidth = 2;
            ctx.strokeRect(spriteLeft - 2, spriteTop - 2, spriteW + 4, spriteH + 4);
          }
        } else if (item.type === "magazine") {
          // Magazine rack
          ctx.fillStyle = `rgba(60,55,45,${fade * 0.7})`;
          ctx.fillRect(spriteLeft, spriteTop + spriteH * 0.2, spriteW, spriteH * 0.8);
          // Magazine covers
          ctx.fillStyle = `rgba(20,20,18,${fade})`;
          ctx.fillRect(spriteLeft + spriteW * 0.1, spriteTop + spriteH * 0.05, spriteW * 0.35, spriteH * 0.5);
          ctx.fillRect(spriteLeft + spriteW * 0.55, spriteTop + spriteH * 0.05, spriteW * 0.35, spriteH * 0.5);
          ctx.strokeStyle = `rgba(200,215,223,${fade * 0.3})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(spriteLeft + spriteW * 0.1, spriteTop + spriteH * 0.05, spriteW * 0.35, spriteH * 0.5);
          ctx.strokeRect(spriteLeft + spriteW * 0.55, spriteTop + spriteH * 0.05, spriteW * 0.35, spriteH * 0.5);

          ctx.fillStyle = `rgba(255,255,255,${fade * 0.6})`;
          ctx.font = `${Math.max(7, spriteW * 0.06)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(item.title, spriteLeft + spriteW / 2, spriteTop + spriteH * 0.9);

          if (isNearby) {
            ctx.strokeStyle = ACCENT;
            ctx.lineWidth = 2;
            ctx.strokeRect(spriteLeft - 2, spriteTop - 2, spriteW + 4, spriteH + 4);
          }
        }
      }

      // HUD — crosshair
      ctx.strokeStyle = `rgba(200,215,223,0.3)`;
      ctx.lineWidth = 1;
      const cx = cw / 2, cy = ch / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();

      // Interaction prompt
      if (closest && !activeItem) {
        ctx.fillStyle = ACCENT;
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`[ E ] ${closest.title}`, cw / 2, ch - 40);
        ctx.fillStyle = "rgba(200,215,223,0.4)";
        ctx.font = "11px monospace";
        ctx.fillText("press E to inspect", cw / 2, ch - 22);
      }

      // Controls hint (subtle)
      if (!canvasFocusedRef.current || (!activeItem && !closest)) {
        ctx.fillStyle = "rgba(200,215,223,0.2)";
        ctx.font = "10px monospace";
        ctx.textAlign = "left";
        ctx.fillText("↑↓ move  ←→ turn", 12, ch - 12);
      }

      // Minimap (top-right corner)
      const mmSize = 80;
      const mmTile = mmSize / MAP_W;
      const mmX = cw - mmSize - 12;
      const mmY = 12;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(mmX, mmY, mmSize, mmSize);
      ctx.strokeStyle = "rgba(200,215,223,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(mmX, mmY, mmSize, mmSize);

      // Map walls
      for (let my = 0; my < MAP_H; my++) {
        for (let mx = 0; mx < MAP_W; mx++) {
          if (MAP[my][mx] === 1) {
            ctx.fillStyle = "rgba(200,215,223,0.15)";
            ctx.fillRect(mmX + mx * mmTile, mmY + my * mmTile, mmTile, mmTile);
          }
        }
      }

      // Player on minimap
      ctx.fillStyle = HIGHLIGHT;
      ctx.beginPath();
      ctx.arc(mmX + p.x * mmTile, mmY + p.y * mmTile, 2, 0, Math.PI * 2);
      ctx.fill();

      // Player direction
      ctx.strokeStyle = HIGHLIGHT;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mmX + p.x * mmTile, mmY + p.y * mmTile);
      ctx.lineTo(mmX + (p.x + Math.cos(p.angle) * 0.8) * mmTile, mmY + (p.y + Math.sin(p.angle) * 0.8) * mmTile);
      ctx.stroke();

      // Item dots on minimap
      for (const item of ITEMS) {
        ctx.fillStyle = closest?.id === item.id ? HIGHLIGHT : "rgba(200,215,223,0.4)";
        ctx.beginPath();
        ctx.arc(mmX + item.worldX * mmTile, mmY + item.worldY * mmTile, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(drawFrame);
    };

    animFrameRef.current = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [isWall, activeItem]);

  // Click handler for canvas focus + E interaction
  const handleCanvasClick = useCallback(() => {
    canvasFocusedRef.current = true;
    if (nearbyItem) setActiveItem(nearbyItem);
  }, [nearbyItem]);

  // Touch controls
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchRef.current = { startX: touch.clientX, startY: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;
    const keys = keysRef.current;
    keys.delete("ArrowUp");
    keys.delete("ArrowDown");
    keys.delete("ArrowLeft");
    keys.delete("ArrowRight");
    if (dy < -20) keys.add("ArrowUp");
    if (dy > 20) keys.add("ArrowDown");
    if (dx < -20) keys.add("ArrowLeft");
    if (dx > 20) keys.add("ArrowRight");
  };

  const handleTouchEnd = () => {
    touchRef.current = null;
    keysRef.current.delete("ArrowUp");
    keysRef.current.delete("ArrowDown");
    keysRef.current.delete("ArrowLeft");
    keysRef.current.delete("ArrowRight");
  };

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight: "110vh" }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="px-6 pt-[68px] pb-4">
          <SectionHeading className="mb-0">Inspiration</SectionHeading>
        </div>

        <motion.div
          className="flex-1 min-h-0 flex flex-col"
          style={{
            paddingLeft: padding,
            paddingRight: padding,
            paddingBottom: padding,
          }}
        >
          <div className="relative flex-1 min-h-0 overflow-hidden border border-border/30">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onClick={handleCanvasClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              tabIndex={0}
            />

            {/* Content overlay */}
            {activeItem && (
              <div
                className="absolute inset-0 flex items-center justify-center z-20"
                style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
                onClick={() => setActiveItem(null)}
              >
                <div
                  className="max-w-md w-full mx-4 border border-border/40 bg-background p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close */}
                  <button
                    onClick={() => setActiveItem(null)}
                    className="absolute top-4 right-4 mono-text hover:text-foreground transition-colors"
                  >
                    ESC ✕
                  </button>

                  {/* Type badge */}
                  <p className="mono-text mb-3">
                    {activeItem.type === "tv" && "📺 Broadcast"}
                    {activeItem.type === "corkboard" && "📌 Pinned"}
                    {activeItem.type === "notebook" && "📓 Note"}
                    {activeItem.type === "magazine" && "📰 Press"}
                  </p>

                  <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                    {activeItem.title}
                  </h3>

                  {activeItem.imageUrl && (
                    <img
                      src={activeItem.imageUrl}
                      alt={activeItem.title}
                      className="w-full aspect-video object-cover mb-4 grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  )}

                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                    {activeItem.content}
                  </p>

                  {activeItem.url && (
                    <a
                      href={activeItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-button inline-block"
                    >
                      Visit →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ── Helpers ──────────────────────────────────────────────── */

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

export default InspirationBoard;
