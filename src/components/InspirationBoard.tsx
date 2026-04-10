import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Environment } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import SectionHeading from "@/components/SectionHeading";

/* ── Data ─────────────────────────────────────────────────── */

interface InspirationItem {
  id: number;
  type: "image" | "quote" | "note" | "link";
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  gridX: number;
  gridZ: number;
  blockHeight: number;
}

const ITEMS: InspirationItem[] = [
  { id: 1, type: "image", title: "Alpine Light", content: "Mountain photography — chasing light at altitude.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", url: "https://unsplash.com", gridX: -3, gridZ: -2, blockHeight: 2.2 },
  { id: 2, type: "image", title: "Color Theory", content: "Exploring gradients and natural palettes.", imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=300&fit=crop", url: "https://unsplash.com", gridX: 2, gridZ: -3, blockHeight: 1.6 },
  { id: 3, type: "image", title: "Street Type", content: "Found type in urban environments.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", url: "https://unsplash.com", gridX: 4, gridZ: 1, blockHeight: 2.8 },
  { id: 4, type: "quote", title: "Steve Jobs", content: "\"Design is not just what it looks like.\nDesign is how it works.\"", gridX: -2, gridZ: 2, blockHeight: 1.8 },
  { id: 5, type: "quote", title: "Da Vinci", content: "\"Simplicity is the\nultimate sophistication.\"", gridX: 1, gridZ: 3, blockHeight: 1.2 },
  { id: 6, type: "note", title: "Note", content: "Explore brutalist\nweb aesthetics —\nraw, honest,\nconfrontational.", gridX: -4, gridZ: 1, blockHeight: 2.5 },
  { id: 7, type: "link", title: "Wired", content: "The Future of\nCreative Tools", url: "https://wired.com", gridX: 3, gridZ: -1, blockHeight: 1.4 },
  { id: 8, type: "link", title: "It's Nice That", content: "Why Brutalism is\nMaking a Comeback", url: "https://itsnicethat.com", gridX: -1, gridZ: -4, blockHeight: 2.0 },
];

const TILE_SIZE = 2.4;
const HOP_DURATION = 0.18;
const ACCENT = "#c8d7df";

/* ── Character ────────────────────────────────────────────── */

interface CharacterProps {
  posRef: React.MutableRefObject<{ x: number; z: number; targetX: number; targetZ: number; t: number; dir: number; hopping: boolean; hopPhase: number }>;
  onNearItem: (item: InspirationItem | null) => void;
}

const Character = ({ posRef, onNearItem }: CharacterProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const p = posRef.current;
    if (!groupRef.current) return;

    // Smooth lerp to target
    if (p.hopping) {
      p.t += delta / HOP_DURATION;
      if (p.t >= 1) {
        p.t = 1;
        p.hopping = false;
        p.x = p.targetX;
        p.z = p.targetZ;
      }
    }

    const lerpX = p.x + (p.targetX - p.x) * Math.min(p.t, 1);
    const lerpZ = p.z + (p.targetZ - p.z) * Math.min(p.t, 1);

    // Hop arc
    const hopProgress = p.hopping ? Math.sin(Math.min(p.t, 1) * Math.PI) : 0;

    groupRef.current.position.set(lerpX * TILE_SIZE, hopProgress * 0.6, lerpZ * TILE_SIZE);

    // Face direction
    const angles = [0, Math.PI, Math.PI / 2, -Math.PI / 2]; // up, down, left, right
    const targetAngle = angles[p.dir] ?? 0;
    const current = groupRef.current.rotation.y;
    groupRef.current.rotation.y = current + (targetAngle - current) * 0.2;

    // Squash/stretch during hop
    if (bodyRef.current) {
      const squash = 1 - hopProgress * 0.15;
      const stretch = 1 + hopProgress * 0.25;
      bodyRef.current.scale.set(squash, stretch, squash);
    }

    // Check nearby items
    let closest: InspirationItem | null = null;
    let closestDist = 2.5;
    for (const item of ITEMS) {
      const d = Math.hypot(lerpX - item.gridX, lerpZ - item.gridZ);
      if (d < closestDist) {
        closestDist = d;
        closest = item;
      }
    }
    onNearItem(closest);
  });

  return (
    <group ref={groupRef}>
      {/* Body - rounded capsule-like shape */}
      <mesh ref={bodyRef} position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.4, 8, 16]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fafaf5" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.08, 1.2, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a18" roughness={0.8} />
      </mesh>
      <mesh position={[-0.08, 1.2, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a18" roughness={0.8} />
      </mesh>
      {/* Shadow blob */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.08} />
      </mesh>
    </group>
  );
};

/* ── Content Block ────────────────────────────────────────── */

interface ContentBlockProps {
  item: InspirationItem;
  isNearby: boolean;
}

const ContentBlock = ({ item, isNearby }: ContentBlockProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load image texture
  useEffect(() => {
    if (item.imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";
      loader.load(item.imageUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        textureRef.current = tex;
        setLoaded(true);
      });
    }
  }, [item.imageUrl]);

  useFrame(() => {
    if (!meshRef.current) return;
    // Subtle hover float
    const targetY = item.blockHeight / 2 + (isNearby ? 0.15 : 0);
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;
  });

  const w = 1.8;
  const d = 0.3;

  // Desaturated material for image face
  const imageMaterial = useMemo(() => {
    if (!textureRef.current) return null;
    return new THREE.MeshStandardMaterial({
      map: textureRef.current,
      roughness: 0.4,
      metalness: 0.0,
      // We'll apply a slight desaturation via onBeforeCompile
    });
  }, [loaded]);

  const baseMat = useMemo(() => (
    <meshStandardMaterial
      color={isNearby ? "#ffffff" : "#f0f0eb"}
      roughness={0.35}
      metalness={0.02}
      emissive={isNearby ? ACCENT : "#000000"}
      emissiveIntensity={isNearby ? 0.08 : 0}
    />
  ), [isNearby]);

  // Build materials array: [+x, -x, +y, -y, +z (front), -z]
  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({
      color: isNearby ? "#ffffff" : "#f0f0eb",
      roughness: 0.35,
      metalness: 0.02,
      emissive: isNearby ? ACCENT : "#000000",
      emissiveIntensity: isNearby ? 0.08 : 0,
    });
    const top = new THREE.MeshStandardMaterial({
      color: isNearby ? "#ffffff" : "#eaeae5",
      roughness: 0.25,
      metalness: 0.05,
    });
    const front = imageMaterial || side.clone();
    return [side, side, top, side, front, side];
  }, [isNearby, imageMaterial]);

  return (
    <group position={[item.gridX * TILE_SIZE, 0, item.gridZ * TILE_SIZE]}>
      {/* Block */}
      <mesh
        ref={meshRef}
        position={[0, item.blockHeight / 2, 0]}
        castShadow
        receiveShadow
        material={item.imageUrl ? materials : undefined}
      >
        <boxGeometry args={[w, item.blockHeight, d]} />
        {!item.imageUrl && baseMat}
      </mesh>

      {/* Text on front face */}
      {!item.imageUrl && (
        <Text
          position={[0, item.blockHeight / 2, d / 2 + 0.01]}
          fontSize={0.11}
          maxWidth={1.5}
          lineHeight={1.4}
          textAlign="center"
          color="#888"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
        >
          {item.content}
        </Text>
      )}

      {/* Title label */}
      <Text
        position={[0, item.blockHeight + 0.25, 0]}
        fontSize={0.09}
        color={isNearby ? ACCENT : "#999"}
        anchorY="bottom"
        textAlign="center"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
        letterSpacing={0.12}
      >
        {item.title.toUpperCase()}
      </Text>

      {/* Interaction prompt */}
      {isNearby && (
        <Text
          position={[0, item.blockHeight + 0.55, 0]}
          fontSize={0.08}
          color={ACCENT}
          anchorY="bottom"
          textAlign="center"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
        >
          {"[ E ] INSPECT"}
        </Text>
      )}

      {/* Type indicator dot */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 8]} />
        <meshBasicMaterial color={isNearby ? ACCENT : "#ddd"} />
      </mesh>
    </group>
  );
};

/* ── Dotted Floor ─────────────────────────────────────────── */

const DottedFloor = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 61 * 61; // 61x61 grid of dots
  const spread = 30;
  const spacing = spread * 2 / 60;

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    let i = 0;
    for (let x = 0; x <= 60; x++) {
      for (let z = 0; z <= 60; z++) {
        dummy.position.set(
          -spread + x * spacing,
          0.005,
          -spread + z * spacing,
        );
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} receiveShadow>
      <circleGeometry args={[0.03, 6]} />
      <meshBasicMaterial color="#bbb" transparent opacity={0.35} />
    </instancedMesh>
  );
};

/* ── Camera Rig ───────────────────────────────────────────── */

interface CameraRigProps {
  posRef: React.MutableRefObject<{ x: number; z: number; targetX: number; targetZ: number; t: number }>;
}

const CameraRig = ({ posRef }: CameraRigProps) => {
  const { camera } = useThree();

  useFrame(() => {
    const p = posRef.current;
    const lerpX = p.x + (p.targetX - p.x) * Math.min(p.t, 1);
    const lerpZ = p.z + (p.targetZ - p.z) * Math.min(p.t, 1);
    const worldX = lerpX * TILE_SIZE;
    const worldZ = lerpZ * TILE_SIZE;

    // Third-person isometric-ish camera
    const targetPos = new THREE.Vector3(worldX + 5, 7, worldZ + 8);
    const targetLook = new THREE.Vector3(worldX, 0.5, worldZ);

    camera.position.lerp(targetPos, 0.04);
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    camera.lookAt(
      camera.position.x + (targetLook.x - camera.position.x) * 0.06,
      camera.position.y + (targetLook.y - camera.position.y) * 0.06 - camera.position.y + 0.5,
      camera.position.z + (targetLook.z - camera.position.z) * 0.06 - camera.position.z,
    );
    camera.lookAt(targetLook.lerp(camera.position, 0.0)); // snap look for now
  });

  return null;
};

/* ── Scene ────────────────────────────────────────────────── */

interface SceneProps {
  onNearItem: (item: InspirationItem | null) => void;
  nearbyItem: InspirationItem | null;
  activeItem: InspirationItem | null;
}

const Scene = ({ onNearItem, nearbyItem, activeItem }: SceneProps) => {
  const posRef = useRef({
    x: 0, z: 0,
    targetX: 0, targetZ: 0,
    t: 1, dir: 0,
    hopping: false, hopPhase: 0,
  });

  // Grid-based movement (Crossy Road style)
  const tryMove = useCallback((dx: number, dz: number, dir: number) => {
    const p = posRef.current;
    if (p.hopping || activeItem) return;
    const newX = p.targetX + dx;
    const newZ = p.targetZ + dz;

    // Check if block is occupied
    const blocked = ITEMS.some((item) => item.gridX === newX && item.gridZ === newZ);
    if (blocked) return;

    // Bounds check
    if (Math.abs(newX) > 6 || Math.abs(newZ) > 6) return;

    p.targetX = newX;
    p.targetZ = newZ;
    p.t = 0;
    p.dir = dir;
    p.hopping = true;
  }, [activeItem]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          tryMove(0, -1, 0);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          tryMove(0, 1, 1);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          tryMove(-1, 0, 2);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          tryMove(1, 0, 3);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryMove]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#f5f5f0" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.2}
        color="#fff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-4, 8, -4]} intensity={0.3} color="#e8e8e0" />

      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#f8f8f3" roughness={0.9} metalness={0} />
      </mesh>

      {/* Dotted grid */}
      <DottedFloor />

      {/* Content blocks */}
      {ITEMS.map((item) => (
        <ContentBlock
          key={item.id}
          item={item}
          isNearby={nearbyItem?.id === item.id}
        />
      ))}

      {/* Character */}
      <Character posRef={posRef} onNearItem={onNearItem} />

      {/* Camera */}
      <CameraRig posRef={posRef} />

      {/* Fog */}
      <fog attach="fog" args={["#f8f8f3", 15, 40]} />
    </>
  );
};

/* ── Main Component ───────────────────────────────────────── */

const InspirationBoard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [nearbyItem, setNearbyItem] = useState<InspirationItem | null>(null);
  const [activeItem, setActiveItem] = useState<InspirationItem | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const padding = useTransform(scrollYProgress, [0, 0.12, 0.25, 0.70, 0.82, 1], [24, 24, 0, 0, 24, 24]);

  // E key to interact, Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && nearbyItem && !activeItem) {
        setActiveItem(nearbyItem);
      }
      if (e.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearbyItem, activeItem]);

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight: "110vh" }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="px-6 pt-[68px] pb-4">
          <SectionHeading className="mb-0">Inspiration</SectionHeading>
        </div>

        <motion.div
          className="flex-1 min-h-0 flex flex-col"
          style={{ paddingLeft: padding, paddingRight: padding, paddingBottom: padding }}
        >
          <div className="relative flex-1 min-h-0 overflow-hidden border border-border/30" style={{ minHeight: "400px" }}>
            <Canvas
              shadows
              camera={{ position: [5, 7, 8], fov: 40 }}
              style={{ width: "100%", height: "100%", background: "#f8f8f3" }}
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            >
              <Scene
                onNearItem={setNearbyItem}
                nearbyItem={nearbyItem}
                activeItem={activeItem}
              />
            </Canvas>

            {/* Controls hint */}
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <p className="mono-text" style={{ fontSize: 9, opacity: 0.4 }}>
                ↑↓←→ MOVE · E INSPECT
              </p>
            </div>

            {/* Content overlay */}
            {activeItem && (
              <div
                className="absolute inset-0 flex items-center justify-center z-20"
                style={{ backgroundColor: "rgba(248,248,243,0.92)", backdropFilter: "blur(8px)" }}
                onClick={() => setActiveItem(null)}
              >
                <div
                  className="max-w-md w-full mx-4 border border-border/40 bg-background p-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setActiveItem(null)}
                    className="absolute top-6 right-6 mono-text hover:text-foreground transition-colors cursor-pointer"
                  >
                    ESC ✕
                  </button>

                  <p className="mono-text mb-4" style={{ color: ACCENT }}>
                    {activeItem.type === "image" && "📺 VISUAL"}
                    {activeItem.type === "quote" && "📌 QUOTE"}
                    {activeItem.type === "note" && "📓 NOTE"}
                    {activeItem.type === "link" && "📰 LINK"}
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

                  <p className="text-sm text-foreground/70 leading-relaxed mb-4 whitespace-pre-line">
                    {activeItem.content.replace(/\\n/g, "\n")}
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

export default InspirationBoard;
