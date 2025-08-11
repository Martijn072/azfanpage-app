
import { useState } from 'react';
import { getWordPressUrl, getPossibleIdentifiers, cleanupDisqus } from '@/utils/disqusUtils';

interface UseDisqusLoaderProps {
  slug: string;
  title: string;
  articleId: string;
}

export const useDisqusLoader = ({ slug, title, articleId }: UseDisqusLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIdentifier, setCurrentIdentifier] = useState<string>('');

  const loadDisqusWithIdentifier = async (identifier: string, wpUrl: string) => {
    console.log(`🔍 Testing identifier: "${identifier}" with URL: "${wpUrl}"`);

    // Clean up any existing Disqus first
    cleanupDisqus();
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if thread container exists
    const threadContainer = document.getElementById('disqus_thread');
    if (!threadContainer) {
      console.error('❌ Disqus thread container not found');
      return false;
    }

    // Simplified Disqus configuration - let Disqus handle its own theme
    window.disqus_config = function () {
      this.page.url = wpUrl;
      this.page.identifier = identifier;
      this.page.title = title;
      
      console.log('🔧 Disqus config set:', {
        url: this.page.url,
        identifier: this.page.identifier,
        title: this.page.title
      });
    };

    // Create and load new Disqus script
    return new Promise<boolean>(resolve => {
      const script = document.createElement('script');
      script.src = 'https://azfanpage.disqus.com/embed.js';
      script.setAttribute('data-timestamp', String(+new Date()));
      script.async = true;

      const timeout = setTimeout(() => {
        console.log(`⏰ Timeout for identifier: ${identifier}`);
        script.remove();
        resolve(false);
      }, 15000);

      script.onload = () => {
        console.log(`✅ Disqus script loaded for identifier: ${identifier}`);
        clearTimeout(timeout);
        setCurrentIdentifier(identifier);
        resolve(true);
      };

      script.onerror = error => {
        console.error(`❌ Failed to load Disqus script for identifier: ${identifier}:`, error);
        clearTimeout(timeout);
        script.remove();
        resolve(false);
      };

      document.head.appendChild(script);
    });
  };

  const loadDisqus = async () => {
    if (isLoaded || isLoading) return;
    console.log('🚀 Starting Disqus identifier mapping process...');
    console.log('📋 Article info:', {
      articleId,
      slug,
      title
    });
    setIsLoading(true);
    setError(null);
    const wordpressUrl = getWordPressUrl(slug);
    const possibleIdentifiers = getPossibleIdentifiers(articleId, slug);
    console.log('🎯 Testing identifiers:', possibleIdentifiers);
    console.log('🔗 WordPress URL:', wordpressUrl);

    // Test each identifier format
    for (const identifier of possibleIdentifiers) {
      console.log(`🧪 Testing identifier format: ${identifier}`);
      try {
        const success = await loadDisqusWithIdentifier(identifier, wordpressUrl);
        if (success) {
          console.log(`🎉 SUCCESS! Working identifier: ${identifier}`);
          setIsLoaded(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error(`💥 Error testing identifier ${identifier}:`, error);
      }

      // Wait between attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // If all WordPress identifiers fail, try with current page URL as fallback
    console.log('🔄 All WordPress identifiers failed, trying fallback with current URL...');
    try {
      const fallbackSuccess = await loadDisqusWithIdentifier(articleId, window.location.href);
      if (fallbackSuccess) {
        console.log('✅ Fallback successful with current URL');
        setIsLoaded(true);
      } else {
        console.error('❌ All identifier formats failed');
        setError('Kon comments niet laden met geen enkele identifier');
      }
    } catch (error) {
      console.error('💥 Fallback also failed:', error);
      setError('Kon comments niet laden');
    }
    setIsLoading(false);
  };

  const resetDisqus = () => {
    console.log('🔄 Resetting Disqus...');
    setIsLoaded(false);
    setIsLoading(false);
    setError(null);
    setCurrentIdentifier('');
    cleanupDisqus();
  };

  return {
    isLoaded,
    isLoading,
    error,
    currentIdentifier,
    loadDisqus,
    resetDisqus
  };
};

