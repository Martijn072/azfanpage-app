
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
        {/* Hero Section */}
        <div className="mb-8">
          <div className="max-w-4xl">
            <h1 className="headline-premium text-headline-xl mb-4 text-az-black dark:text-white leading-tight">
              AZ Wedstrijdprogramma
            </h1>
            <p className="body-premium text-body-lg text-premium-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Alle AZ wedstrijden seizoen 2024-2025. Gespeelde en komende wedstrijden in alle competities.
            </p>
          </div>
        </div>

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
