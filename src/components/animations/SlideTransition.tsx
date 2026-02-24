"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

interface SlideTransitionProps {
  children: ReactNode;
  transitionKey: string | number;
  direction?: "left" | "right";
  duration?: number;
  className?: string;
}

export default function SlideTransition({
  children,
  transitionKey,
  duration = 250,
  className = "",
}: SlideTransitionProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"enter" | "idle">("idle");
  const prevKeyRef = useRef(transitionKey);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (transitionKey !== prevKeyRef.current) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) {
        setDisplayChildren(children);
        prevKeyRef.current = transitionKey;
        return;
      }

      // Start enter phase with new content
      setPhase("enter");
      setDisplayChildren(children);
      prevKeyRef.current = transitionKey;

      // Settle to idle
      const timer = setTimeout(() => setPhase("idle"), duration);
      return () => clearTimeout(timer);
    } else {
      // Same key, just update children
      setDisplayChildren(children);
    }
  }, [transitionKey, children, duration]);

  const style: React.CSSProperties =
    phase === "enter"
      ? {
          animation: `slide-in-right ${duration}ms ease-out forwards`,
        }
      : {};

  return (
    <div className={className} style={style}>
      {displayChildren}
    </div>
  );
}
