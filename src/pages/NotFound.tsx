import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Home, RotateCcw } from "lucide-react";

const BOARD_SIZE = 5;
const START = 0;
const TARGET = 24;
const BLOCKED = new Set([6, 8, 12, 16, 18]);
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const neighborsFor = (position: number) => {
  const row = Math.floor(position / BOARD_SIZE);
  const col = position % BOARD_SIZE;
  return {
    up: row > 0 ? position - BOARD_SIZE : position,
    down: row < BOARD_SIZE - 1 ? position + BOARD_SIZE : position,
    left: col > 0 ? position - 1 : position,
    right: col < BOARD_SIZE - 1 ? position + 1 : position,
  };
};

const distanceToTarget = (position: number) => {
  const row = Math.floor(position / BOARD_SIZE);
  const col = position % BOARD_SIZE;
  const targetRow = Math.floor(TARGET / BOARD_SIZE);
  const targetCol = TARGET % BOARD_SIZE;
  return Math.abs(row - targetRow) + Math.abs(col - targetCol);
};

const NotFound = () => {
  const location = useLocation();
  const [position, setPosition] = useState(START);
  const [moves, setMoves] = useState(0);
  const escaped = position === TARGET;
  const cells = useMemo(() => Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => index), []);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const moveTo = useCallback((nextPosition: number) => {
    if (nextPosition === position || BLOCKED.has(nextPosition) || escaped) return;
    setPosition(nextPosition);
    setMoves((count) => count + 1);
  }, [escaped, position]);

  const move = useCallback((direction: keyof ReturnType<typeof neighborsFor>) => {
    moveTo(neighborsFor(position)[direction]);
  }, [moveTo, position]);

  const reset = () => {
    setPosition(START);
    setMoves(0);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        move("up");
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        move("down");
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move("left");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move("right");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--highlight)/0.9),transparent)]" />
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(18rem,0.6fr)] md:gap-12">
        <motion.section
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.68, ease: EASE }}
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/38">404 / route drift</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.9] tracking-tight md:text-7xl">
            This page slipped between the pixels.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-foreground/62 md:text-base">
            Get the bright square back to the exit, or bail out gracefully. Both are respectable in production.
          </p>

          <div className="mt-8 flex flex-wrap gap-[3px]">
            <Link to="/" className="site-corner homepage-cta group inline-flex items-center bg-primary px-4 py-3 font-mono text-sm uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent">
              Home
              <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-w-[2rem] group-hover:opacity-100">
                <Home className="ml-2 h-4 w-4 shrink-0" strokeWidth={1.5} />
              </span>
            </Link>
            <button
              type="button"
              onClick={reset}
              className="site-corner group inline-flex items-center bg-foreground/[0.08] px-4 py-3 font-mono text-sm uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground/[0.14]"
            >
              Reset
              <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-w-[2rem] group-hover:opacity-100">
                <RotateCcw className="ml-2 h-4 w-4 shrink-0" strokeWidth={1.5} />
              </span>
            </button>
          </div>
        </motion.section>

        <motion.section
          className="site-corner border border-foreground/10 bg-foreground/[0.035] p-3 shadow-[0_18px_54px_rgba(0,0,0,0.18)]"
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.72, ease: EASE, delay: 0.08 }}
          aria-label="404 pixel game"
        >
          <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/38">
            <span>{escaped ? "Exit found" : `${distanceToTarget(position)} steps-ish`}</span>
            <span>{moves} moves</span>
          </div>

          <div className="grid aspect-square grid-cols-5 gap-[3px]">
            {cells.map((cell) => {
              const isBlocked = BLOCKED.has(cell);
              const isPlayer = cell === position;
              const isTarget = cell === TARGET;
              const canClick =
                !escaped && !isBlocked && Object.values(neighborsFor(position)).includes(cell) && cell !== position;

              return (
                <button
                  key={cell}
                  type="button"
                  onClick={() => canClick && moveTo(cell)}
                  disabled={!canClick}
                  aria-label={isTarget ? "Exit tile" : isBlocked ? "Blocked tile" : `Tile ${cell + 1}`}
                  className={`site-corner relative min-h-12 overflow-hidden border transition-colors ${
                    isBlocked
                      ? "border-foreground/[0.08] bg-foreground/[0.025]"
                      : isTarget
                        ? "border-[hsl(var(--highlight)/0.55)] bg-[hsl(var(--highlight)/0.18)]"
                        : "border-foreground/10 bg-foreground/[0.055]"
                  } ${canClick ? "cursor-pointer hover:border-foreground/30 hover:bg-foreground/[0.1]" : "cursor-default"}`}
                >
                  {isTarget ? <span className="absolute inset-3 border border-[hsl(var(--highlight)/0.5)]" /> : null}
                  {isPlayer ? (
                    <motion.span
                      layoutId="lost-pixel"
                      className="absolute inset-1.5 bg-[hsl(var(--highlight))] shadow-[0_0_22px_hsl(var(--highlight)/0.35)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-[3px]">
            <span />
            <button type="button" onClick={() => move("up")} className="site-corner flex h-11 items-center justify-center bg-foreground/[0.08] transition-colors hover:bg-foreground/[0.14]" aria-label="Move up">
              <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span />
            <button type="button" onClick={() => move("left")} className="site-corner flex h-11 items-center justify-center bg-foreground/[0.08] transition-colors hover:bg-foreground/[0.14]" aria-label="Move left">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => move("down")} className="site-corner flex h-11 items-center justify-center bg-foreground/[0.08] transition-colors hover:bg-foreground/[0.14]" aria-label="Move down">
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => move("right")} className="site-corner flex h-11 items-center justify-center bg-foreground/[0.08] transition-colors hover:bg-foreground/[0.14]" aria-label="Move right">
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default NotFound;
