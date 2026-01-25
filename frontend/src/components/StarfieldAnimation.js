import React, { useRef, useEffect } from "react";

const StarfieldAnimation = ({ starsCount = 300, velocity = 1, radius = 1 }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const stars = useRef([]);
  const center = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      center.current.x = canvas.width / 2;
      center.current.y = canvas.height / 2;
    };

    class Star {
      constructor() {
        this.init();
      }
      init() {
        this.radius = Math.random() * radius;
        this.x = center.current.x;
        this.y = center.current.y;
        this.lineWidth = 0;
        this.vel = {
          x: Math.random() * 4 - 2,
          y: Math.random() * 4 - 2,
        };
      }
      update() {
        this.lineWidth += 0.035;
        this.x0 = this.x;
        this.y0 = this.y;
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.draw();
        if (this.isDead()) this.init();
      }
      draw() {
        context.beginPath();
        context.moveTo(this.x0, this.y0);
        context.lineTo(this.x, this.y);
        context.lineWidth = this.lineWidth;
        context.stroke();
      }
      isDead() {
        return (
          this.x < 0 ||
          this.x > canvas.width ||
          this.y < 0 ||
          this.y > canvas.height
        );
      }
    }

    const start = () => {
      stars.current = [];
      for (let i = 0; i < starsCount; i++) {
        setTimeout(() => {
          stars.current.push(new Star());
        }, i * 30);
      }
    };

    const render = () => {
      context.fillStyle = "rgba(255, 255, 255, 0.8)"; // background color changed to white with opacity
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#5D4A68"; // line color changed to #5D4A68
      stars.current.forEach((star) => star.update());
    };

    const animate = () => {
      animationFrameId.current = window.requestAnimationFrame(animate);
      render();
    };

    resize();
    window.addEventListener("resize", resize);
    start();
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", resize);
    };
  }, [starsCount, radius]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
};

export default StarfieldAnimation;
