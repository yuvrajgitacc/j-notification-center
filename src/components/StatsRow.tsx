import { motion } from "framer-motion";
import { Bell, Clock, CalendarClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
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

const StatsRow = ({ vertical }: StatsRowProps) => {
  const { data: stats = { totalToday: 0, pending: 0, nextSync: 'Live' } } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    refetchInterval: 5000,
  });

  return (
    <div className={`flex gap-3 ${vertical ? "flex-col" : ""}`}>
      <StatCard 
        icon={<Bell size={20} />} 
        label="Alerts Today" 
        value={stats.totalToday} 
        sub={`${stats.totalToday > 5 ? 'High Activity' : 'Quiet Day'}`} 
      />
      <StatCard 
        icon={<Clock size={20} />} 
        label="Pending" 
        value={stats.pending} 
        sub={stats.pending > 0 ? "Needs Review" : "All Clear"} 
      />
      <StatCard 
        icon={<CalendarClock size={20} />} 
        label="Next Sync" 
        value={stats.nextSync} 
        sub="Connected" 
      />
    </div>
  );
};

export default StatsRow;
