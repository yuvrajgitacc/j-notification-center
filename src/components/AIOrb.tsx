import { motion } from "framer-motion";

interface AIOrbProps {
  status?: "connected" | "offline" | "thinking";
}

const AIOrb = ({ status = "connected" }: AIOrbProps) => {
  const statusColor = {
    connected: "bg-neon-green",
    offline: "bg-neon-red",
    thinking: "bg-primary",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <motion.div
        className="absolute w-28 h-28 rounded-full border border-border/50"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Orbital dots */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(54px) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-border/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[45, 135, 225, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(46px) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Orb */}
      <motion.div
        className="relative w-20 h-20 rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle at 35% 35%, hsl(210 20% 92%), hsl(220 15% 50%), hsl(220 20% 20%))",
        }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Status indicator */}
      <div className="absolute -bottom-6 flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${statusColor[status]}`}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {status === "connected" ? "Ready" : status === "thinking" ? "Thinking" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default AIOrb;
