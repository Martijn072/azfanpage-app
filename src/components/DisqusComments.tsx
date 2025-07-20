
import { useEffect, useRef } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useDisqusLoader } from '@/hooks/useDisqusLoader';
import { DisqusContainer } from './DisqusContainer';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisqusCommentsProps {
  slug: string;
  title: string;
  articleId: string;
}

export const DisqusComments = ({
  slug,
  title,
  articleId
}: DisqusCommentsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const {
    isLoaded,
    isLoading,
    error,
    currentIdentifier,
    loadDisqus,
    resetDisqus
  } = useDisqusLoader({ slug, title, articleId });

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '100px 0px'
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mt-8 pt-6 border-t border-premium-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        {/* Dark mode suggestion */}
        {isDarkMode && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-sm">
                <Sun className="w-4 h-4" />
                <span>Voor de beste ervaring met reacties, schakel naar light mode</span>
              </div>
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30"
              >
                <Sun className="w-3 h-3 mr-1" />
                Light mode
              </Button>
            </div>
          </div>
        )}

        <DisqusContainer
          isLoaded={isLoaded}
          isLoading={isLoading}
          error={error}
          currentIdentifier={currentIdentifier}
          onLoadDisqus={loadDisqus}
          onResetDisqus={resetDisqus}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
