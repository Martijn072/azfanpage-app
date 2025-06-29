
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, Home, Bell, Calendar, Table, Users, Trophy } from "lucide-react";

export const HeaderMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "news", label: "Nieuws", icon: Bell, path: "/nieuws" },
    { id: "programma", label: "Programma", icon: Calendar, path: "/programma" },
    { id: "eredivisie", label: "Eredivisie Stand", icon: Table, path: "/eredivisie" },
    { id: "spelers", label: "Speler Statistieken", icon: Users, path: "/spelers" },
    { id: "conference", label: "Conference League", icon: Trophy, path: "/conference-league" },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-premium-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:ring-2 focus:ring-az-red"
        >
          <Menu className="w-5 h-5 text-premium-gray-600 dark:text-gray-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors focus:ring-2 focus:ring-az-red ${
                isActive 
                  ? 'bg-az-red/10 text-az-red dark:bg-az-red/20' 
                  : 'hover:bg-premium-gray-50 dark:hover:bg-gray-700 text-premium-gray-700 dark:text-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-az-red' : ''}`} />
              <span className={`font-medium ${isActive ? 'text-az-red' : ''}`}>
                {item.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
