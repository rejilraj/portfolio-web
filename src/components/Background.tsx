"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/*
  Ambient node-and-link field behind the page. Nods to the real-time / networked
  systems in the work, and reacts to the pointer so the page feels live rather
  than decorated: nodes lean toward the cursor and link to it when close.

  Canvas + rAF only. It never touches React state, respects reduced motion, and
  sits behind everything with pointer-events disabled. The whole layer also
  parallaxes: it scrolls slower than the content, so it reads as far away.
*/
export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Far plane: travels a fraction of the page scroll.
  const { scrollYProgress } = useScroll();
  const rawY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const y = useSpring(rawY, { stiffness: 60, damping: 24 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];

    // Cursor lives off-screen until the pointer actually moves.
    const pointer = { x: -9999, y: -9999 };
    const POINTER_RADIUS = 190;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round((width * height) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Gentle attraction toward the cursor, capped so nodes never clump.
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < POINTER_RADIUS && dist > 1) {
          const pull = (1 - dist / POINTER_RADIUS) * 0.35;
          n.x += (dx / dist) * pull;
          n.y += (dy / dist) * pull;
        }
      }

      // Node-to-node links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(61, 225, 255, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor links: the network notices you
      for (const n of nodes) {
        const dist = Math.hypot(pointer.x - n.x, pointer.y - n.y);
        if (dist < POINTER_RADIUS) {
          const strength = 1 - dist / POINTER_RADIUS;
          ctx.strokeStyle = `rgba(61, 225, 255, ${0.3 * strength})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();

          ctx.fillStyle = `rgba(167, 139, 250, ${0.5 * strength})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.4 + strength * 1.8, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        ctx.fillStyle = "rgba(61, 225, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      draw();
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <motion.div
      aria-hidden
      style={{ y }}
      className="pointer-events-none fixed inset-x-0 -top-[10%] h-[120%] z-0"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "radial-gradient(120% 80% at 78% 0%, rgba(61,225,255,0.10), transparent 55%), radial-gradient(90% 60% at 0% 100%, rgba(167,139,250,0.08), transparent 60%)",
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full opacity-70" />
      </div>
    </motion.div>
  );
}
