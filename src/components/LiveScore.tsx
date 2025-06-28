
export const LiveScore = () => {
  return (
    <div className="bg-gradient-to-r from-az-red to-red-700 text-white mx-4 mt-4 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-az-red font-bold text-xs">AZ</span>
            </div>
            <span className="font-semibold">AZ Alkmaar</span>
          </div>
        </div>
        
        <div className="text-center px-6">
          <div className="text-2xl font-bold mb-1">2 - 1</div>
          <div className="text-xs opacity-90">67' ⚽ LIVE</div>
        </div>
        
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-semibold">PSV</span>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-xs">PSV</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="flex justify-between text-xs opacity-90">
          <span>⚪🔴 Volg live</span>
          <span>AFAS Stadion • Eredivisie</span>
        </div>
      </div>
    </div>
  );
};
