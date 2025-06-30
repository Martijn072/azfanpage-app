
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { CommunitySection } from "@/components/CommunitySection";
import { useState } from "react";

const Community = () => {
  const [activeTab, setActiveTab] = useState("community");

  console.log('Community page rendering');

  return (
    <div className="min-h-screen bg-premium-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-fade-in">
            <CommunitySection />
          </div>
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Community;
