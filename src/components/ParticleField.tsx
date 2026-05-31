"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  count?: number;
  className?: string;
  variant?: "hero" | "subtle" | "auth";
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: "dot" | "leaf";
  rotation: number;
  rotationSpeed: number;
}

export default function ParticleField({
  count = 40,
  className = "",
  variant = "hero",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: variant === "subtle" ? 2 + Math.random() * 3 : 3 + Math.random() * 5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -0.2 - Math.random() * 0.5,
        opacity: variant === "hero" ? 0.15 + Math.random() * 0.35 : 0.08 + Math.random() * 0.2,
        type: Math.random() > 0.6 ? "leaf" : "dot",
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      }));
    };

    const drawLeaf = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(173, 191, 160, ${p.opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        if (p.type === "leaf") {
          drawLeaf(p);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, [count, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
