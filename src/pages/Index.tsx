
import { useState } from "react";
import { Header } from "@/components/Header";
import { NewsCard } from "@/components/NewsCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { LiveScore } from "@/components/LiveScore";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ArticlesSkeleton } from "@/components/ArticlesSkeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useArticles } from "@/hooks/useArticles";

const Index = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [selectedCategory, setSelectedCategory] = useState("Alles");
  
  const { data, isLoading, error, refetch } = useArticles(1, 20, '', selectedCategory === 'Alles' ? '' : selectedCategory);

  const categories = ["Alles", "Wedstrijdverslag", "Transfer", "Jeugd", "Interviews", "Nieuws"];

  const articles = data?.articles || [];
  const breakingNews = articles.filter(article => article.isBreaking);

  return (
    <div className="min-h-screen bg-premium-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Live Score Widget */}
      <LiveScore />
      
      <div className="px-4 pb-20 pt-6">
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Breaking News Badge */}
        {breakingNews.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="breaking-news">🔥 Breaking</span>
              <span className="text-premium-gray-600 dark:text-gray-300 text-sm">
                {breakingNews.length} {breakingNews.length === 1 ? 'nieuw artikel' : 'nieuwe artikelen'}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading && <ArticlesSkeleton />}
        
        {error && <ErrorMessage onRetry={() => refetch()} />}
        
        {data && !isLoading && !error && (
          <>
            {/* News Feed */}
            <div className="space-y-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {articles.length === 0 && (
              <div className="card-premium dark:bg-gray-800 dark:border-gray-700 p-8 text-center">
                <p className="body-premium text-premium-gray-600 dark:text-gray-300">
                  Geen artikelen gevonden voor de categorie "{selectedCategory}".
                </p>
              </div>
            )}

            {/* Load More */}
            {articles.length > 0 && (
              <div className="mt-8 text-center">
                <button 
                  className="btn-secondary dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => refetch()}
                >
                  Ververs voor nieuw nieuws
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
