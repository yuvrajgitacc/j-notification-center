import { motion } from "framer-motion";
import { Check, Clock, MessageCircle } from "lucide-react";

interface Notification {
  id: number;
  icon: string;
  title: string;
  body: string;
  time: string;
  category: string;
}

const notifications: Notification[] = [
  { id: 1, icon: "📧", title: "Email from Sarah", body: "Q1 report ready for review", time: "2m ago", category: "Email" },
  { id: 2, icon: "💊", title: "Health Reminder", body: "Time to take your vitamin D supplement", time: "15m ago", category: "Health" },
  { id: 3, icon: "💼", title: "Meeting Alert", body: "Team standup in 15 minutes — prepare updates", time: "28m ago", category: "Work" },
  { id: 4, icon: "📱", title: "App Update", body: "J v2.4 is available with new features", time: "1h ago", category: "System" },
  { id: 5, icon: "🏦", title: "Banking Alert", body: "Monthly subscription charged — $14.99", time: "2h ago", category: "Finance" },
  { id: 6, icon: "📅", title: "Calendar", body: "Dentist appointment tomorrow at 10 AM", time: "3h ago", category: "Personal" },
  { id: 7, icon: "🔔", title: "System Notice", body: "Your weekly report summary is ready", time: "4h ago", category: "System" },
  { id: 8, icon: "📝", title: "Task Due", body: "Complete project proposal by end of day", time: "5h ago", category: "Work" },
];

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
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground tracking-wider uppercase px-1">
        Notification Feed
      </h2>
      <div className={`flex flex-col gap-2 overflow-y-auto pr-1 ${expanded ? "max-h-[600px]" : "max-h-[400px]"}`}>
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            className="glass-card rounded-lg p-3.5 flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-xl mt-0.5">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
              <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                {n.category}
              </span>
            </div>
            <div className="flex gap-0.5 shrink-0">
              <ActionButton><Check size={14} /></ActionButton>
              <ActionButton><Clock size={14} /></ActionButton>
              <ActionButton><MessageCircle size={14} /></ActionButton>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationFeed;
