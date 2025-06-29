
import { Instagram, Facebook, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SocialMediaPromo = () => {
  const socialMediaLinks = [
    {
      name: "Instagram",
      handle: "@azfanpagenl",
      followers: "12.5K",
      url: "https://instagram.com/azfanpagenl",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "Twitter/X",
      handle: "@azfanpage",
      followers: "8.2K",
      url: "https://twitter.com/azfanpage",
      icon: X,
      color: "bg-black",
    },
    {
      name: "Facebook",
      handle: "AZFanpage",
      followers: "15.8K",
      url: "https://facebook.com/azfanpage",
      icon: Facebook,
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 rounded-xl shadow-lg border border-premium-gray-200 dark:border-gray-700 p-6 my-8 mx-2">
      <div className="text-center mb-6">
        <h3 className="headline-premium text-headline-md text-az-black dark:text-white mb-2">
          Volg AZFanpage
        </h3>
        <p className="body-premium text-premium-gray-600 dark:text-gray-300 text-body-md">
          Mis geen AZ nieuws! Volg ons voor de laatste updates
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {socialMediaLinks.map((platform) => {
          const Icon = platform.icon;
          return (
            <div
              key={platform.name}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-premium-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-full ${platform.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-premium-gray-600 dark:text-gray-300">
                  {platform.followers}
                </span>
              </div>
              
              <div className="mb-3">
                <h4 className="font-semibold text-az-black dark:text-white text-sm">
                  {platform.name}
                </h4>
                <p className="text-premium-gray-500 dark:text-gray-400 text-xs">
                  {platform.handle}
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-az-red hover:bg-red-700 text-white text-sm py-2 group-hover:scale-105 transition-all duration-200"
              >
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Volgen
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-premium-gray-500 dark:text-gray-400">
          🔥 Join duizenden AZ fans die al connected zijn!
        </p>
      </div>
    </div>
  );
};
