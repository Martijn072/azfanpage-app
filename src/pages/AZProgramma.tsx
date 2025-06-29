
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AZFixtures } from "@/components/AZFixtures";
import { useAZTeamId } from "@/hooks/useFootballApi";
import { ErrorMessage } from "@/components/ErrorMessage";

const AZProgramma = () => {
  const [activeTab, setActiveTab] = useState("programma");
  const { data: teamId, isLoading: teamIdLoading, error: teamIdError, refetch: refetchTeamId } = useAZTeamId();

  if (teamIdError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="px-4 pt-6 pb-20">
          <ErrorMessage onRetry={() => refetchTeamId()} />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="px-4 pb-20 pt-6">
        {/* AZ Fixtures */}
        <div>
          <AZFixtures teamId={teamId} isLoadingTeamId={teamIdLoading} />
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AZProgramma;
