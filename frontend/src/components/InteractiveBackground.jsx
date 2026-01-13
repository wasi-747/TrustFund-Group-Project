import React, { useEffect, useRef } from "react";

const InteractiveBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // 🎨 CONFIGURATION BASED ON THEME
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Config: Dark Mode vs Light Mode
    const bgFill = isDark ? "#020402" : "#ffffff"; // Deep Black vs Pure White
    const orbColors = isDark
      ? [
          "rgba(16, 185, 129, 0.15)",
          "rgba(20, 184, 166, 0.12)",
          "rgba(6, 95, 70, 0.20)",
        ] // Glowing Emeralds
      : [
          "rgba(16, 185, 129, 0.08)",
          "rgba(52, 211, 153, 0.08)",
          "rgba(209, 250, 229, 0.4)",
        ]; // Subtle Pastels

    const orbs = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: orbColors[Math.floor(Math.random() * orbColors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Base
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off walls
        if (orb.x < -orb.radius || orb.x > canvas.width + orb.radius)
          orb.vx *= -1;
        if (orb.y < -orb.radius || orb.y > canvas.height + orb.radius)
          orb.vy *= -1;

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // 👈 Re-run when theme changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 transition-opacity duration-1000"
    />
  );
};

export default InteractiveBackground;
