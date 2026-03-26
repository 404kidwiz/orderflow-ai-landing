"use client";

import { useEffect, useState, useCallback } from "react";
import { useSpring, animated } from "@react-spring/web";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Spring for smooth cursor following
  const [cursorSpring, cursorApi] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 0.1, tension: 800, friction: 30 },
  }));

  // Spring for ring with more lag
  const [ringSpring, ringApi] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { mass: 0.3, tension: 400, friction: 25 },
  }));

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      // Update CSS custom properties for aurora effect
      document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);

      // Direct spring updates for performance
      cursorApi.start({ x: e.clientX, y: e.clientY });
      ringApi.start({ x: e.clientX, y: e.clientY });
    },
    [isVisible, cursorApi, ringApi]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    ringApi.start({ scale: 1.5 });
  }, [ringApi]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    ringApi.start({ scale: 1 });
  }, [ringApi]);

  useEffect(() => {
    // Check for touch device
    const checkTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Add hover listeners to clickable elements
    const clickables = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
    );

    clickables.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    // Hide cursor when leaving window
    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setIsVisible(false);
    };
    const handleMouseOver = () => setIsVisible(true);

    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isTouchDevice, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Dot cursor */}
      <animated.div
        className={`${styles.cursor} ${isVisible ? styles.visible : ""}`}
        style={{
          transform: cursorSpring.x.to((x) => `translate(${x}px, ${cursorSpring.y.get()}px) translate(-50%, -50%)`),
        }}
      />

      {/* Ring cursor */}
      <animated.div
        className={`${styles.ring} ${isVisible ? styles.visible : ""} ${isHovering ? styles.hovering : ""}`}
        style={{
          transform: ringSpring.x.to((x) =>
            `translate(${x}px, ${ringSpring.y.get()}px) translate(-50%, -50%) scale(${ringSpring.scale.get()})`
          ),
        }}
      />
    </>
  );
}
