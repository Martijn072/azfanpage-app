import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MessageSquare, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Forum = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forum");
  const [isLoading, setIsLoading] = useState(true);
  const [webviewError, setWebviewError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const forumUrl = "https://www.azfanpage.nl/forum/";

  useEffect(() => {
    // Handle iframe load
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        setIsLoading(false);
        setWebviewError(false);
      };

      const handleError = () => {
        setIsLoading(false);
        setWebviewError(true);
        toast({
          title: "Forum laden mislukt",
          description: "Er is een probleem bij het laden van het forum. Probeer opnieuw.",
          variant: "destructive",
        });
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, [toast]);

  const handleNewTopic = () => {
    if (iframeRef.current) {
      // Try to navigate iframe to new topic page
      try {
        iframeRef.current.src = `${forumUrl}posting.php?mode=post`;
      } catch (error) {
        // Fallback: open in new tab
        window.open(`${forumUrl}posting.php?mode=post`, '_blank');
      }
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setWebviewError(false);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const openInBrowser = () => {
    window.open(forumUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-premium-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      {/* Forum Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-premium-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-az-red" />
          <h1 className="text-lg font-bold text-az-black dark:text-white">
            AZ Forum
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-premium-gray-600 dark:text-gray-300 hover:text-az-red"
          >
            Vernieuwen
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInBrowser}
            className="text-premium-gray-600 dark:text-gray-300 hover:text-az-red"
          >
            Browser
          </Button>
        </div>
      </div>

      {/* Forum Content */}
      <div className="flex-1 relative bg-white dark:bg-gray-900">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-az-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-premium-gray-600 dark:text-gray-400">
                Forum laden...
              </p>
            </div>
          </div>
        )}

        {webviewError ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-premium-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-premium-gray-600 dark:text-gray-300 mb-2">
                Forum niet beschikbaar
              </h3>
              <p className="text-premium-gray-500 dark:text-gray-400 mb-6">
                Het forum kan momenteel niet worden geladen. Probeer het later opnieuw.
              </p>
              <div className="space-y-3">
                <Button onClick={handleRefresh} className="w-full">
                  Opnieuw proberen
                </Button>
                <Button variant="outline" onClick={openInBrowser} className="w-full">
                  Open in browser
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={forumUrl}
            className="w-full h-full border-0"
            title="AZ Forum"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            loading="lazy"
          />
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleNewTopic}
        className="fixed bottom-24 right-4 w-14 h-14 bg-az-red hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-40"
        aria-label="Nieuw topic starten"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Forum;