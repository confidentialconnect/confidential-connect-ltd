import { useEffect, useRef } from "react";

export const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mouse position
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Particles with enhanced properties
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];

    // Create more particles with color variety
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1.5 - 0.75,
        opacity: Math.random() * 0.6 + 0.3,
        hue: Math.random() * 60 + 200, // Blue to purple range
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Floating orbs
    const orbs: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      hue: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 5; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 100,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 60 + 200,
        alpha: Math.random() * 0.03 + 0.02,
      });
    }

    let time = 0;

    // Animation loop
    const animate = () => {
      time += 0.01;
      
      // Create a trailing effect instead of complete clear
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating orbs with gradient
      orbs.forEach((orb) => {
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, `hsla(${orb.hue}, 80%, 60%, ${orb.alpha})`);
        gradient.addColorStop(0.5, `hsla(${orb.hue + 20}, 70%, 50%, ${orb.alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${orb.hue + 40}, 60%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);
      });

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Mouse interaction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 150;
          particle.speedX -= Math.cos(angle) * force * 0.2;
          particle.speedY -= Math.sin(angle) * force * 0.2;
        }

        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Apply friction
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        // Boundary check with wrap-around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulsing effect
        particle.pulsePhase += particle.pulseSpeed;
        const pulseSize = particle.size + Math.sin(particle.pulsePhase) * 1;
        const pulseOpacity = particle.opacity + Math.sin(particle.pulsePhase) * 0.2;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, pulseSize * 2);
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, ${pulseOpacity})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 50%, ${pulseOpacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles with gradient lines
        particles.forEach((otherParticle, otherIndex) => {
          if (index < otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              const gradient = ctx.createLinearGradient(
                particle.x, particle.y,
                otherParticle.x, otherParticle.y
              );
              const opacity = (1 - distance / 120) * 0.3;
              gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 50%, ${opacity})`);
              gradient.addColorStop(1, `hsla(${otherParticle.hue}, 70%, 50%, ${opacity})`);
              
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 z-0 animate-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70"></div>
        <div className="absolute inset-0 gradient-mesh opacity-30 animate-pulse-slow"></div>
      </div>
      
      {/* Interactive canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ opacity: 0.8 }}
      />
      
      {/* Floating shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </>
  );
};
