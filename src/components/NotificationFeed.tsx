import { motion } from "framer-motion";
import { Check, Clock, MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
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

const ActionButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
  >
    {children}
  </button>
);

interface NotificationFeedProps {
  expanded?: boolean;
}

const NotificationFeed = ({ expanded }: NotificationFeedProps) => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/notifications`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    refetchInterval: 5000, // Poll every 5s for new notifications
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
    return <div className="p-4 text-center text-muted-foreground">Loading alerts...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground tracking-wider uppercase px-1">
        Notification Feed
      </h2>
      <div className={`flex flex-col gap-2 overflow-y-auto pr-1 ${expanded ? "max-h-[600px]" : "max-h-[400px]"}`}>
        {notifications.length === 0 ? (
          <div className="glass-card rounded-lg p-8 text-center text-muted-foreground">
            No notifications yet. J is quiet.
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              className={`glass-card rounded-lg p-3.5 flex items-start gap-3 transition-opacity ${
                n.status === 'read' ? 'opacity-60' : 'opacity-100'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-xl mt-0.5">{n.icon || "🔔"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                <div className="flex items-center gap-2 mt-1.5">
                   <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                    {n.category}
                  </span>
                  {n.status === 'unread' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex gap-0.5 shrink-0">
                <ActionButton onClick={() => markAsReadMutation.mutate(n.id)}>
                  <Check size={14} />
                </ActionButton>
                <ActionButton><Clock size={14} /></ActionButton>
                <ActionButton><MessageCircle size={14} /></ActionButton>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationFeed;
