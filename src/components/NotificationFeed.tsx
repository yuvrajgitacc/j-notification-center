import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle, ChevronRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { API_BASE_URL } from "@/config";
import { useState } from "react";

interface Notification {
  id: number;
  icon: string;
  title: string;
  body: string;
  time: string;
  category: string;
  status: string;
}

const ActionButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
  >
    {children}
  </button>
);

interface NotificationFeedProps {
  variant?: "compact" | "full";
}

const NotificationFeed = ({ variant = "full" }: NotificationFeedProps) => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/notifications`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    refetchInterval: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground animate-pulse text-xs">Syncing with J...</div>;
  }

  const displayNotifications = variant === "compact" ? notifications.slice(0, 5) : notifications;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">
          {variant === "compact" ? "Recent Activity" : "Live Alerts"}
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {displayNotifications.length === 0 ? (
          <div className="glass-card rounded-lg p-8 text-center text-muted-foreground text-xs">
            No activity logged.
          </div>
        ) : (
          displayNotifications.map((n, i) => (
            <motion.div
              key={n.id}
              onClick={() => variant === "full" && setSelectedId(selectedId === n.id ? null : n.id)}
              className={`glass-card rounded-xl p-3 flex items-center gap-3 transition-all cursor-pointer ${
                n.status === 'read' ? 'opacity-50' : 'opacity-100 border-l-2 border-l-primary'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
            >
              {/* Icon Logic: Handle both emoji and image URLs */}
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 overflow-hidden">
                {n.icon?.startsWith('http') ? (
                  <img src={n.icon} alt="" className="w-5 h-5 object-contain" />
                ) : (
                  <span className="text-sm">{n.icon || "🔔"}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`font-semibold text-foreground truncate ${variant === "compact" ? "text-[11px]" : "text-sm"}`}>
                    {n.title}
                  </p>
                  <span className="text-[9px] text-muted-foreground shrink-0 font-mono">
                    {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {variant === "full" && selectedId === n.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed border-t border-border/30 pt-2">
                        {n.body}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase font-bold">
                          {n.category}
                        </span>
                        <div className="flex gap-1">
                          <ActionButton onClick={() => markAsReadMutation.mutate(n.id)}>
                            <Check size={14} />
                          </ActionButton>
                          <ActionButton><MessageCircle size={14} /></ActionButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {variant === "full" && (
                <ChevronRight 
                  size={14} 
                  className={`text-muted-foreground transition-transform ${selectedId === n.id ? "rotate-90" : ""}`} 
                />
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationFeed;
