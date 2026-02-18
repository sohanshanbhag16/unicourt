import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", move);

    const animate = () => {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = posX + "px";
        cursorRef.current.style.top = posY + "px";
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div className="cursor" ref={cursorRef} />;
}
