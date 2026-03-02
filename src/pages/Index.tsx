import DashboardHeader from "@/components/DashboardHeader";
import AIOrb from "@/components/AIOrb";
import StatsRow from "@/components/StatsRow";
import NotificationFeed from "@/components/NotificationFeed";
import ActivityChart from "@/components/ActivityChart";
import CommandInput from "@/components/CommandInput";
import { Home, Archive, BarChart3, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col min-h-screen max-w-2xl mx-auto px-4 w-full">
        <DashboardHeader />
        <div className="flex justify-center py-8">
          <AIOrb status="connected" />
        </div>
        <div className="mb-4">
          <StatsRow />
        </div>
        <div className="mb-4 flex-1">
          <NotificationFeed />
        </div>
        <div className="mb-4">
          <ActivityChart />
        </div>
        <div className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
          <CommandInput />
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
            {[
              { icon: Home, label: "Dashboard", active: true },
              { icon: Archive, label: "Archive", active: false },
              { icon: BarChart3, label: "Analytics", active: false },
              { icon: Settings, label: "Settings", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon size={18} />
                {label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
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
                <p className="text-[10px] text-muted-foreground">Free Plan</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <h2 className="text-lg font-semibold text-foreground">Notification Center</h2>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              Connected · 24ms
            </div>
          </header>

          {/* Content Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-12 gap-5 max-w-7xl mx-auto">
              {/* Left Column - Orb + Stats */}
              <div className="col-span-4 xl:col-span-3 flex flex-col gap-5">
                <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
                  <AIOrb status="connected" />
                  <div className="mt-10" />
                </div>
                <StatsRow vertical />
              </div>

              {/* Center Column - Feed */}
              <div className="col-span-8 xl:col-span-5 flex flex-col gap-5">
                <NotificationFeed expanded />
              </div>

              {/* Right Column - Charts */}
              <div className="hidden xl:flex xl:col-span-4 flex-col gap-5">
                <ActivityChart />
                {/* Category breakdown */}
                <div className="glass-card rounded-lg p-4">
                  <h2 className="text-sm font-medium text-muted-foreground tracking-wider uppercase mb-3">
                    Categories
                  </h2>
                  <div className="space-y-2.5">
                    {[
                      { label: "Work", pct: 40, color: "bg-primary" },
                      { label: "Health", pct: 25, color: "bg-neon-green" },
                      { label: "Finance", pct: 20, color: "bg-neon-amber" },
                      { label: "Personal", pct: 15, color: "bg-muted-foreground" },
                    ].map((c) => (
                      <div key={c.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-secondary-foreground">{c.label}</span>
                          <span className="text-muted-foreground">{c.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Command bar */}
          <div className="px-6 pb-4 pt-2 border-t border-border/20">
            <div className="max-w-3xl mx-auto">
              <CommandInput />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
