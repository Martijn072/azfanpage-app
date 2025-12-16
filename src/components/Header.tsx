import { useState } from "react";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { HeaderMenu } from "./HeaderMenu";
import { NavigationMenuItems } from "./header/NavigationMenuItems";
import { SearchOverlay } from "./SearchOverlay";
import { useNotifications } from "@/hooks/useNotifications";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <>      
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm transition-colors duration-200">
        <div className="px-s py-s">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/02689d46-9781-412f-9093-feef3e99cfe2.png" 
                alt="AZ Fanpage - Officiële fansite van AZ Alkmaar" 
                className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-az-red rounded"
                onClick={handleLogoClick}
                role="img"
              />
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex-1 flex justify-center">
                <NavigationMenuItems />
              </div>
            )}

            {/* Mobile Actions */}
            {isMobile ? (
              <div className="flex items-center gap-s">
                {/* Notifications */}
                <button 
                  onClick={handleNotificationClick}
                  className="p-2 hover:bg-muted rounded-lg transition-colors relative focus:ring-2 focus:ring-az-red"
                  aria-label="Notificaties"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-az-red text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </button>

                {/* Dark Mode Toggle */}
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-muted rounded-lg transition-colors focus:ring-2 focus:ring-az-red"
                  aria-label={isDarkMode ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Hamburger Menu */}
                <HeaderMenu onSearchClick={handleSearchClick} />
              </div>
            ) : (
              /* Desktop Actions */
              <div className="flex items-center gap-s">
                <button 
                  onClick={handleSearchClick}
                  className="p-2 hover:bg-muted rounded-lg transition-colors focus:ring-2 focus:ring-az-red"
                  aria-label="Zoeken"
                >
                  <Search className="w-5 h-5 text-muted-foreground" />
                </button>
                <button 
                  onClick={handleNotificationClick}
                  className="p-2 hover:bg-muted rounded-lg transition-colors relative focus:ring-2 focus:ring-az-red"
                  aria-label="Notificaties"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-az-red text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-muted rounded-lg transition-colors focus:ring-2 focus:ring-az-red"
                  aria-label={isDarkMode ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <HeaderMenu />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};
