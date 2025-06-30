
import { SocialMediaCard } from "./SocialMediaCard";
import { useSocialMediaPosts } from "@/hooks/useSocialMediaPosts";
import { Users, RefreshCw, AlertCircle } from "lucide-react";

export const CommunitySection = () => {
  const { data: posts, isLoading, error, refetch } = useSocialMediaPosts();

  console.log('🔍 CommunitySection render state:', { 
    posts: posts?.length || 0, 
    isLoading, 
    error: error?.message,
    hasData: !!posts
  });

  if (error) {
    console.error('❌ CommunitySection error details:', error);
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="headline-premium text-headline-lg text-az-black dark:text-white font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-az-red" />
            AZ Supporters delen
          </h2>
        </div>
        
        <div className="card-premium dark:bg-gray-800 p-8 text-center border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="body-premium text-body-lg text-red-600 dark:text-red-400 mb-4 font-medium">
            Kan social media content niet laden
          </p>
          <p className="text-sm text-premium-gray-600 dark:text-gray-400 mb-4">
            {error.message}
          </p>
          <button
            onClick={() => {
              console.log('🔄 Manual refetch triggered');
              refetch();
            }}
            className="flex items-center gap-2 bg-az-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Probeer opnieuw
          </button>
        </div>
      </section>
    );
  }

  if (isLoading) {
    console.log('⏳ CommunitySection loading...');
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="headline-premium text-headline-lg text-az-black dark:text-white font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-az-red" />
            AZ Supporters delen
          </h2>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-premium-gray-200 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                <div className="text-premium-gray-400 dark:text-gray-500">
                  Laden van Instagram posts...
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    console.log('📭 No posts found, showing empty state');
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="headline-premium text-headline-lg text-az-black dark:text-white font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-az-red" />
            AZ Supporters delen
          </h2>
        </div>
        
        <div className="card-premium dark:bg-gray-800 p-8 text-center">
          <p className="body-premium text-body-lg text-premium-gray-600 dark:text-gray-300 mb-4">
            Geen recente Instagram posts gevonden. We zoeken naar AZ content en #AZFanpage.
          </p>
          <button
            onClick={() => {
              console.log('🔄 Manual refetch from empty state');
              refetch();
            }}
            className="flex items-center gap-2 bg-az-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Vernieuw
          </button>
        </div>
      </section>
    );
  }

  const instagramPosts = posts.filter(post => post.platform === 'instagram');
  console.log(`📱 Rendering ${instagramPosts.length} Instagram posts out of ${posts.length} total`);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="headline-premium text-headline-lg text-az-black dark:text-white font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-az-red" />
          AZ Supporters delen
        </h2>
        <button
          onClick={() => {
            console.log('🔄 Manual refresh button clicked');
            refetch();
          }}
          className="text-az-red hover:text-red-700 p-2 rounded-lg hover:bg-premium-gray-50 dark:hover:bg-gray-800 transition-colors"
          title="Vernieuw Instagram posts"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          📱 Momenteel alleen Instagram posts - X/Twitter is tijdelijk uitgeschakeld voor testing
        </p>
      </div>
      
      {/* Vertical list voor mobile-first */}
      <div className="space-y-4">
        {instagramPosts.slice(0, 6).map((post, index) => {
          console.log('🎨 Rendering post:', { id: post.id, platform: post.platform, username: post.username });
          return (
            <div 
              key={post.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SocialMediaCard post={post} />
            </div>
          );
        })}
      </div>
      
      {instagramPosts.length > 6 && (
        <div className="text-center mt-6">
          <p className="text-sm text-premium-gray-500 dark:text-gray-400">
            Toont de laatste 6 Instagram posts • Vernieuw voor meer content
          </p>
        </div>
      )}
    </section>
  );
};
