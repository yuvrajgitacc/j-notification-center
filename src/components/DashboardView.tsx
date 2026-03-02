import AIOrb from "@/components/AIOrb";
import StatsRow from "@/components/StatsRow";
import NotificationFeed from "@/components/NotificationFeed";

const DashboardView = () => {
  return (
    <div className="grid grid-cols-12 gap-5 max-w-7xl mx-auto">
      {/* Left Column - Orb + Stats */}
      <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-5">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
          <AIOrb status="connected" />
          <div className="mt-10" />
        </div>
        <StatsRow vertical />
      </div>

      {/* Right Column - Feed (Now taking more space since Chart is gone) */}
      <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-5">
        <NotificationFeed expanded />
      </div>
    </div>
  );
};

export default DashboardView;
