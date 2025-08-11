
import { useEffect, useRef } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useDisqusLoader } from '@/hooks/useDisqusLoader';
import { DisqusContainer } from './DisqusContainer';

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
  const { isDarkMode } = useDarkMode();
  const {
    isLoaded,
    isLoading,
    error,
    currentIdentifier,
    loadDisqus,
    resetDisqus
  } = useDisqusLoader({ slug, title, articleId });

  // Intersection Observer for automatic lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoaded && !isLoading) {
          console.log('🎯 Disqus comments section is visible, auto-loading...');
          loadDisqus();
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '200px 0px'
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [isLoaded, isLoading, loadDisqus]);

  return (
    <div ref={containerRef} className="mt-8 pt-6 border-t border-premium-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
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
