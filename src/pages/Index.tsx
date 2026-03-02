import DashboardHeader from "@/components/DashboardHeader";
import AIOrb from "@/components/AIOrb";
import StatsRow from "@/components/StatsRow";
import NotificationFeed from "@/components/NotificationFeed";
import ActivityChart from "@/components/ActivityChart";
import CommandInput from "@/components/CommandInput";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-2xl mx-auto px-4">
      <DashboardHeader />

      {/* Orb Section */}
      <div className="flex justify-center py-8">
        <AIOrb status="connected" />
      </div>

      {/* Stats */}
      <div className="mb-4">
        <StatsRow />
      </div>

      {/* Notification Feed */}
      <div className="mb-4 flex-1">
        <NotificationFeed />
      </div>

      {/* Activity Chart */}
      <div className="mb-4">
        <ActivityChart />
      </div>

      {/* Command Input - Sticky Bottom */}
      <div className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
        <CommandInput />
      </div>
    </div>
  );
};

export default Index;
