import { useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

export default function Cube() {
  const ref = useRef(null);
  const [speed, setSpeed] = useState(100);
  useAnimationFrame((t) => {
    const rotate = Math.sin(t / 10000) * speed;
    const y = (1 + Math.sin(t / 1000)) * -50;
    ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
  });

  return (
    <motion.div
      whileHover={{ scale: 1.6 }}
      onHoverStart={() => setSpeed(1000)}
      onHoverEnd={() => setSpeed(100)}
      className="cube-container"
    >
      <div className="cube" ref={ref}>
        <div className="side front" />
        <div className="side left" />
        <div className="side right" />
        <div className="side top" />
        <div className="side bottom" />
        <div className="side back" />
      </div>
    </motion.div>
  );
}
