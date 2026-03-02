import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Search, Archive as ArchiveIcon } from "lucide-react";
import { useState } from "react";
import { API_BASE_URL } from "@/config";

interface Notification {
  id: number;
  icon: string;
  title: string;
  body: string;
  time: string;
  category: string;
  status: string;
}

const ArchiveView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications", "read"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/notifications?status=read`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  const filtered = notifications.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArchiveIcon className="text-primary" /> Notification Archive
          </h2>
          <p className="text-sm text-muted-foreground">Review your past alerts and messages from J.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg outline-none focus:ring-1 focus:ring-primary w-full md:w-64 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading archive...</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center text-muted-foreground border-dashed border-2">
            <ArchiveIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>No archived notifications found.</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <motion.div
              key={n.id}
              className="glass-card rounded-lg p-4 flex items-start gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="text-2xl">{n.icon || "🔔"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {n.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground italic">
                    {new Date(n.time).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchiveView;
