
// Utility functions for Disqus integration

// Generate WordPress URL from slug
export const getWordPressUrl = (slug: string) => {
  return `https://www.azfanpage.nl/${slug}/`;
};

// Generate possible identifier formats that WordPress might use
export const getPossibleIdentifiers = (articleId: string, slug: string) => {
  return [
    `post-${articleId}`,
    articleId,
    `${articleId} https://www.azfanpage.nl/${slug}/`,
    slug,
    `https://www.azfanpage.nl/${slug}/`
  ];
};

// Clean up function to remove Disqus completely
export const cleanupDisqus = () => {
  console.log('🧹 Cleaning up existing Disqus...');

  // Remove existing Disqus script
  const existingScript = document.querySelector('script[src*="disqus.com/embed.js"]');
  if (existingScript) {
    existingScript.remove();
    console.log('Removed existing Disqus script');
  }

  // Clear thread container
  const threadContainer = document.getElementById('disqus_thread');
  if (threadContainer) {
    threadContainer.innerHTML = '';
    console.log('Cleared Disqus thread container');
  }

  // Remove global Disqus variables
  if (window.DISQUS) {
    delete window.DISQUS;
    console.log('Removed global DISQUS object');
  }
  if (window.disqus_config) {
    delete window.disqus_config;
    console.log('Removed global disqus_config');
  }

  // Clear any Disqus iframes that might be lingering
  const disqusIframes = document.querySelectorAll('iframe[src*="disqus"]');
  disqusIframes.forEach(iframe => iframe.remove());
};

// Type declaration for Disqus global configuration
declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config: () => void;
      }) => void;
    };
  }
}
