"use client";

import { useEffect, useRef } from "react";

type AmbientParticlesProps = {
  density?: number;
  className?: string;
  /** RGB triplet, e.g. "181,87,107" (rose). */
  rgb?: string;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  driftX: number;
  speed: number;
  phase: number;
  opacity: number;
};

/** Ambient floating petal-dust canvas. Purely decorative — sits behind content. */
export default function AmbientParticles({
  density = 0.00009,
  className = "",
  rgb = "199,124,139",
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;

    const spawn = () => {
      const count = Math.max(18, Math.floor(width * height * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.5,
        driftX: (Math.random() - 0.5) * 0.15,
        speed: Math.random() * 0.25 + 0.05,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.45 + 0.15,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    };

    // Skip the (main-thread) canvas redraw while the page is actively
    // scrolling — this is purely decorative and competes with scroll
    // compositing for CPU time, which is what actually causes visible jank.
    let scrollPausedUntil = 0;
    const onScroll = () => {
      scrollPausedUntil = performance.now() + 200;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = (now: number = 0) => {
      if (now < scrollPausedUntil) {
        frameId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(p.phase + p.y * 0.01) * p.driftX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        const twinkle = 0.65 + 0.35 * Math.sin(p.phase + p.y * 0.05);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.opacity * twinkle})`;
        ctx.fill();
      }
      frameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      draw();
      cancelAnimationFrame(frameId);
      // draw a single static frame
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.opacity})`;
        ctx.fill();
      }
    } else {
      frameId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, [density, rgb]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
