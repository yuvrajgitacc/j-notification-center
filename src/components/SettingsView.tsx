import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, BellRing, VolumeX, ShieldCheck, Database as DBIcon } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const SettingsView = () => {
  const queryClient = useQueryClient();

  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const toggleSetting = (key: string) => {
    const currentValue = settings[key] === 'true';
    updateSettingMutation.mutate({ [key]: !currentValue });
  };

  const setPriority = (level: string) => {
    updateSettingMutation.mutate({ priority_level: level });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading preferences...</div>;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="text-primary" /> Notification Settings
        </h2>
        <p className="text-sm text-muted-foreground">Customize how you receive alerts from J.</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Toggle Settings */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BellRing size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive real-time alerts on your phone via FCM.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('push_enabled')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.push_enabled === 'true' ? 'bg-primary' : 'bg-secondary'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.push_enabled === 'true' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="h-px bg-border/50" />

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-neon-amber/10 text-neon-amber">
                <VolumeX size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quiet Mode</p>
                <p className="text-xs text-muted-foreground">Mute all sounds and vibration for incoming alerts.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('quiet_mode')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.quiet_mode === 'true' ? 'bg-neon-amber' : 'bg-secondary'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.quiet_mode === 'true' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4 mb-2">
            <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Priority Filtering</p>
              <p className="text-xs text-muted-foreground">Filter alerts based on their importance level.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-2">
            {['All', 'Important', 'Urgent'].map((level) => (
              <button
                key={level}
                onClick={() => setPriority(level.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                  settings.priority_level === level.toLowerCase()
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card rounded-xl p-6 flex items-center justify-between border-dashed border-2">
           <div className="flex items-center gap-4">
             <DBIcon size={20} className="text-muted-foreground" />
             <div>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Relay Database</p>
               <p className="text-xs text-primary font-mono">SQLite 3.x Connected</p>
             </div>
           </div>
           <button 
             onClick={() => toast.info("Exporting local notification history...")}
             className="text-xs text-muted-foreground hover:text-foreground underline"
           >
             Export Data
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
