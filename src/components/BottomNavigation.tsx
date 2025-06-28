
import { Bell, Calendar, MessageSquare, MoreHorizontal } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "news", label: "Nieuws", icon: Bell },
    { id: "live", label: "Live", icon: Calendar },
    { id: "forum", label: "Forum", icon: MessageSquare },
    { id: "more", label: "Meer", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-premium-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-az-red bg-red-50' 
                  : 'text-premium-gray-600 hover:text-premium-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-az-red' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-az-red' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
