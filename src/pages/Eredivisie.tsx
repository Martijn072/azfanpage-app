
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { EredivisieStandings } from "@/components/EredivisieStandings";

const Eredivisie = () => {
  const [activeTab, setActiveTab] = useState("eredivisie");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="px-4 pb-20 pt-6">
        {/* Eredivisie Standings */}
        <div>
          <EredivisieStandings />
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Eredivisie;
