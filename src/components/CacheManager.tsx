
import { useState, useEffect } from 'react';
import { Trash2, Download, HardDrive } from 'lucide-react';
import { articleCache } from '@/services/articleCache';
import { Button } from '@/components/ui/button';

export const CacheManager = () => {
  const [cacheStats, setCacheStats] = useState(null);
  const [cachedArticles, setCachedArticles] = useState([]);

  useEffect(() => {
    updateCacheInfo();
  }, []);

  const updateCacheInfo = () => {
    const stats = articleCache.getCacheStats();
    const articles = articleCache.getCachedArticles();
    setCacheStats(stats);
    setCachedArticles(articles);
  };

  const handleClearCache = () => {
    if (confirm('Weet je zeker dat je alle offline artikelen wilt verwijderen?')) {
      articleCache.clearCache();
      updateCacheInfo();
    }
  };

  const handleRemoveArticle = (id) => {
    articleCache.removeCachedArticle(id);
    updateCacheInfo();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!cacheStats) return null;

  return (
    <div className="card-premium dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="headline-premium text-headline-md text-az-black dark:text-white">
          Offline Opslag
        </h3>
        <Button
          onClick={handleClearCache}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
          disabled={cacheStats.totalArticles === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Alles wissen
        </Button>
      </div>

      {/* Cache Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-premium-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-az-red" />
            <span className="text-sm font-medium text-premium-gray-600 dark:text-gray-300">
              Artikelen
            </span>
          </div>
          <span className="text-2xl font-bold text-az-black dark:text-white">
            {cacheStats.totalArticles}
          </span>
        </div>

        <div className="bg-premium-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-az-red" />
            <span className="text-sm font-medium text-premium-gray-600 dark:text-gray-300">
              Opslag
            </span>
          </div>
          <span className="text-2xl font-bold text-az-black dark:text-white">
            {formatFileSize(cacheStats.totalSize)}
          </span>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
            <div 
              className="bg-az-red h-2 rounded-full transition-all duration-300"
              style={{ width: `${(cacheStats.totalSize / cacheStats.maxSize) * 100}%` }}
            />
          </div>
          <span className="text-xs text-premium-gray-500 dark:text-gray-400 mt-1">
            van {formatFileSize(cacheStats.maxSize)} gebruikt
          </span>
        </div>
      </div>

      {/* Cached Articles List */}
      {cachedArticles.length > 0 && (
        <div>
          <h4 className="font-medium text-premium-gray-800 dark:text-gray-200 mb-3">
            Offline Artikelen
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {cachedArticles.slice(0, 10).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-premium-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-az-black dark:text-white truncate">
                    {article.title}
                  </h5>
                  <p className="text-xs text-premium-gray-500 dark:text-gray-400">
                    {article.category} • {new Date(article.cachedAt).toLocaleDateString('nl-NL')}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveArticle(article.id)}
                  className="ml-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {cachedArticles.length > 10 && (
              <p className="text-xs text-premium-gray-500 dark:text-gray-400 text-center py-2">
                En nog {cachedArticles.length - 10} artikelen...
              </p>
            )}
          </div>
        </div>
      )}

      {cacheStats.totalArticles === 0 && (
        <div className="text-center py-8">
          <Download className="w-12 h-12 mx-auto mb-4 text-premium-gray-300 dark:text-gray-600" />
          <p className="text-premium-gray-600 dark:text-gray-300 mb-2">
            Geen offline artikelen opgeslagen
          </p>
          <p className="text-sm text-premium-gray-500 dark:text-gray-400">
            Artikelen worden automatisch opgeslagen wanneer je ze leest
          </p>
        </div>
      )}
    </div>
  );
};
