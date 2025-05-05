"use client";
import { useEffect, useState } from "react";
import styles from "../styles/MouseLight.module.scss";

export default function MouseLightWrapper({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={styles.lightContainer}>
      <div
        className={styles.lightSpot}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {children}
    </div>
  );
}
