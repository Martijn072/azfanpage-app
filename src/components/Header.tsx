
import { Bell, Search, Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white border-b border-premium-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-az-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AZ</span>
            </div>
            <div>
              <h1 className="font-headline font-bold text-az-black text-lg">
                AZFanpage.nl
              </h1>
              <p className="text-xs text-premium-gray-500 -mt-1">
                Kritisch, onafhankelijk, betrokken
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-premium-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-premium-gray-600" />
            </button>
            <button className="p-2 hover:bg-premium-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-premium-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-az-red rounded-full"></div>
            </button>
            <button className="p-2 hover:bg-premium-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-premium-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
