import DashboardHeader from "@/components/DashboardHeader";
import CommandInput from "@/components/CommandInput";
import DashboardView from "@/components/DashboardView";
import ArchiveView from "@/components/ArchiveView";
import SettingsView from "@/components/SettingsView";
import ActivityChart from "@/components/ActivityChart";
import NotificationFeed from "@/components/NotificationFeed";
import { Home, Archive, BarChart3, Settings, Bell } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardView />;
      case "Alerts":
        return (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Bell className="text-primary" /> Notifications
              </h2>
              <p className="text-sm text-muted-foreground">Click a notification to read the full message from J.</p>
            </div>
            <NotificationFeed variant="full" />
          </div>
        );
      case "Archive":
        return <ArchiveView />;
      case "Analytics":
        return (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="text-primary" /> System Analytics
            </h2>
            <div className="glass-card rounded-xl p-8 h-[500px]">
              <ActivityChart />
            </div>
          </div>
        );
      case "Settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Bell, label: "Alerts" },
    { icon: Archive, label: "Archive" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col h-screen max-w-2xl mx-auto px-4 w-full overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 py-4 overflow-y-auto custom-scrollbar pb-32">
          {renderContent()}
        </div>
        
        {/* Mobile Nav */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-50">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
             {activeTab === "Dashboard" && <CommandInput />}
             <nav className="flex justify-around items-center bg-secondary/80 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-2xl">
              {navItems.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`p-3 rounded-xl transition-all ${
                    activeTab === label ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground"
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 xl:w-72 border-r border-border/50 glass flex flex-col p-5 shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-full shrink-0"
              style={{
                background: "radial-gradient(circle at 35% 35%, hsl(210 20% 92%), hsl(220 15% 50%), hsl(220 20% 20%))",
              }}
            />
            <div>
              <h1 className="text-base font-semibold text-foreground">J</h1>
              <p className="text-[10px] text-primary tracking-[0.15em] uppercase">AI Secretary</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === label
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon size={18} />
                {label}
                {activeTab === label && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 px-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                U
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">User</p>
                <p className="text-[10px] text-muted-foreground">Pro Plan</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <h2 className="text-lg font-semibold text-foreground">{activeTab}</h2>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              Connected · 24ms
            </div>
          </header>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-secondary/5">
             {renderContent()}
          </div>

          {/* Command bar (only shown on Dashboard) */}
          {activeTab === "Dashboard" && (
            <div className="px-6 pb-4 pt-2 border-t border-border/20">
              <div className="max-w-3xl mx-auto">
                <CommandInput />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
