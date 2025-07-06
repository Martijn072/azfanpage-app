import { Building2, ExternalLink, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Partner {
  id: string;
  name: string; 
  description: string;
  logo: string;
  tier: string;
  since: string;
  category: string;
  tagline?: string;
}

interface PartnerCardProps {
  partner: Partner;
}

export const PartnerCard = ({ partner }: PartnerCardProps) => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate(`/partner/${partner.id}`);
  };

  const handleViewPartner = () => {
    navigate(`/partner/${partner.id}`);
  };

  return (
    <article className="card-premium dark:bg-gray-800 dark:border-gray-700 overflow-hidden animate-slide-up w-full max-w-full group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Logo/Icon Area */}
      <div className="relative aspect-[16/9] overflow-hidden cursor-pointer w-full bg-gradient-to-br from-az-red/5 to-az-red/10 dark:from-az-red/10 dark:to-az-red/20 flex items-center justify-center" onClick={handleTitleClick}>
        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Building2 className="w-8 h-8 text-az-red" />
        </div>
        
        {partner.tier === "premium" && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3" />
              Premium
            </span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-az-red/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-lg hover:bg-az-red/90 hover:scale-105 transition-all duration-200 cursor-pointer">
          {partner.category}
        </div>
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 w-full max-w-full">
        <h2 
          className="headline-premium text-headline-md mb-3 hover:text-az-red transition-colors duration-300 cursor-pointer break-words text-az-black dark:text-white group-hover:text-az-red"
          onClick={handleTitleClick}
        >
          {partner.name}
        </h2>
        
        {partner.tagline && (
          <p className="text-sm font-medium text-az-red mb-2 break-words">
            {partner.tagline}
          </p>
        )}
        
        <p className="body-premium text-body-md text-premium-gray-600 dark:text-gray-300 mb-4 line-clamp-2 break-words">
          {partner.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-premium-gray-500 dark:text-gray-400 flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="truncate">Partner sinds {partner.since}</span>
          </div>
        </div>
      </div>
      
      {/* Interaction strip */}
      <div className="px-6 pb-4 w-full max-w-full">
        <div className="flex items-center justify-between pt-4 border-t border-premium-gray-100 dark:border-gray-700">
          <button 
            onClick={handleViewPartner}
            className="flex items-center gap-2 bg-az-red hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 group/btn transform"
          >
            <span className="text-sm whitespace-nowrap">Ontdek meer</span>
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200 flex-shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
};