"use client";

import { useEffect, useState } from "react";

interface LiveCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function LiveCounter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
}: LiveCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => v + Math.random() * 0.5);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.floor(value).toLocaleString("en-IN");

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
