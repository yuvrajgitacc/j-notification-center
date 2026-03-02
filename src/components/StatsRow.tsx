import { motion } from "framer-motion";
import { Bell, Clock, CalendarClock } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

const StatCard = ({ icon, label, value, sub }: StatCardProps) => (
  <motion.div
    className="glass-card rounded-lg p-4 flex-1 min-w-0"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
        {sub && <p className="text-xs text-primary glow-text">{sub}</p>}
      </div>
    </div>
  </motion.div>
);

interface StatsRowProps {
  vertical?: boolean;
}

const StatsRow = ({ vertical }: StatsRowProps) => (
  <div className={`flex gap-3 ${vertical ? "flex-col" : ""}`}>
    <StatCard icon={<Bell size={20} />} label="Alerts Today" value="12" sub="3 urgent" />
    <StatCard icon={<Clock size={20} />} label="Pending" value="3" sub="Snoozed" />
    <StatCard icon={<CalendarClock size={20} />} label="Next Sync" value="15m" sub="Meeting" />
  </div>
);

export default StatsRow;
