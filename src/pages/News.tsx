
import { useState } from "react";
import { Header } from "@/components/Header";
import { NewsCard } from "@/components/NewsCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArticlesSkeleton } from "@/components/ArticlesSkeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useArticles } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";

const News = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [displayCount, setDisplayCount] = useState(10);
  
  const { data: articles, isLoading, error, refetch } = useArticles();

  const displayedArticles = articles?.slice(0, displayCount) || [];
  const hasMore = articles && articles.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  return (
    <div className="min-h-screen bg-premium-gray-50">
      <Header />
      
      <div className="px-4 pb-20 pt-6">
        <div className="mb-6">
          <h1 className="headline-premium text-headline-xl mb-2 text-az-black">
            Alle Nieuws
          </h1>
          <p className="body-premium text-body-md text-premium-gray-600">
            Het laatste nieuws over AZ Alkmaar
          </p>
        </div>

        {/* Content */}
        {isLoading && <ArticlesSkeleton />}
        
        {error && <ErrorMessage onRetry={() => refetch()} />}
        
        {articles && !isLoading && !error && (
          <>
            {/* News Feed */}
            <div className="space-y-6">
              {displayedArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {displayedArticles.length === 0 && (
              <div className="card-premium p-8 text-center">
                <p className="body-premium text-premium-gray-600">
                  Geen artikelen gevonden.
                </p>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleLoadMore}
                  className="bg-az-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
                >
                  Laad meer artikelen
                </Button>
              </div>
            )}

            {/* Total count info */}
            {articles.length > 0 && (
              <div className="mt-4 text-center text-sm text-premium-gray-500">
                {displayedArticles.length} van {articles.length} artikelen getoond
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default News;
