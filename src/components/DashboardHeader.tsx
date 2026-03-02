import { motion } from "framer-motion";
import { Wifi } from "lucide-react";

const DashboardHeader = () => {
  return (
    <motion.header
      className="flex items-center justify-between py-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            className="w-8 h-8 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, hsl(210 20% 92%), hsl(220 15% 50%), hsl(220 20% 20%))",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green border-2 border-background"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">J</h1>
          <p className="text-[10px] text-primary tracking-[0.15em] uppercase">AI Secretary</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Wifi size={14} className="text-neon-green" />
        <span className="text-[10px] font-medium">24ms</span>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
