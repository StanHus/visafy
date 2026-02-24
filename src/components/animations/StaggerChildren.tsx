"use client";

import { useEffect, useRef, useState, Children, ReactNode } from "react";

interface StaggerChildrenProps {
  children: ReactNode;
  staggerMs?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  triggerOnScroll?: boolean;
  className?: string;
}

export default function StaggerChildren({
  children,
  staggerMs = 100,
  duration = 500,
  direction = "up",
  triggerOnScroll = false,
  className = "",
}: StaggerChildrenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    if (triggerOnScroll) {
      const el = ref.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );

      observer.observe(el);
      return () => observer.unobserve(el);
    } else {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [triggerOnScroll]);

  const translateMap = {
    up: "translateY(20px)",
    down: "translateY(-20px)",
    left: "translateX(20px)",
    right: "translateX(-20px)",
  };

  if (!mounted) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => (
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translate(0)" : translateMap[direction],
            transition: `opacity ${duration}ms ease-out ${index * staggerMs}ms, transform ${duration}ms ease-out ${index * staggerMs}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
