interface CachedArticle {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  isBreaking: boolean;
  readTime: string;
  cachedAt: string;
  isOfflineAvailable: boolean;
}

interface CacheStats {
  totalArticles: number;
  totalSize: number;
  maxSize: number;
}

class ArticleCacheService {
  private readonly CACHE_KEY = 'az_cached_articles';
  private readonly MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly MAX_ARTICLES = 50;

  // Cache an article
  async cacheArticle(article: any, content?: string): Promise<void> {
    try {
      const cached = this.getCachedArticles();
      
      const cachedArticle: CachedArticle = {
        ...article,
        content: content || article.content,
        cachedAt: new Date().toISOString(),
        isOfflineAvailable: true
      };

      // Remove existing version if it exists
      const filtered = cached.filter(a => a.id !== article.id);
      
      // Add new version at the beginning
      filtered.unshift(cachedArticle);

      // Keep only the most recent articles within limits
      const limited = filtered.slice(0, this.MAX_ARTICLES);

      // Check size and remove oldest if needed
      const finalCache = this.ensureSizeLimit(limited);

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(finalCache));
      console.log(`✅ Cached article: ${article.title}`);
    } catch (error) {
      console.error('Error caching article:', error);
    }
  }

  // Get cached articles
  getCachedArticles(): CachedArticle[] {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error getting cached articles:', error);
      return [];
    }
  }

  // Get a specific cached article
  getCachedArticle(id: number): CachedArticle | null {
    const cached = this.getCachedArticles();
    return cached.find(article => article.id === id) || null;
  }

  // Check if article is cached
  isArticleCached(id: number): boolean {
    return this.getCachedArticle(id) !== null;
  }

  // Cache multiple articles (for homepage)
  async cacheArticles(articles: any[]): Promise<void> {
    for (const article of articles) {
      await this.cacheArticle(article);
    }
  }

  // Get cache statistics
  getCacheStats(): CacheStats {
    const cached = this.getCachedArticles();
    const totalSize = new Blob([JSON.stringify(cached)]).size;
    
    return {
      totalArticles: cached.length,
      totalSize,
      maxSize: this.MAX_CACHE_SIZE
    };
  }

  // Clear old cache entries
  private ensureSizeLimit(articles: CachedArticle[]): CachedArticle[] {
    let currentSize = new Blob([JSON.stringify(articles)]).size;
    
    while (currentSize > this.MAX_CACHE_SIZE && articles.length > 5) {
      articles.pop(); // Remove oldest
      currentSize = new Blob([JSON.stringify(articles)]).size;
    }
    
    return articles;
  }

  // Clear all cache
  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    console.log('🗑️ Article cache cleared');
  }

  // Remove specific article from cache
  removeCachedArticle(id: number): void {
    const cached = this.getCachedArticles();
    const filtered = cached.filter(article => article.id !== id);
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(filtered));
  }
}

export const articleCache = new ArticleCacheService();
