
import { SocialMediaCard } from "./SocialMediaCard";
import { useSocialMediaPosts } from "@/hooks/useSocialMediaPosts";
import { Users, RefreshCw } from "lucide-react";

export const CommunitySection = () => {
  const { data: posts, isLoading, error, refetch } = useSocialMediaPosts();

  console.log('CommunitySection render:', { posts, isLoading, error });

  if (error) {
    console.error('CommunitySection error:', error);
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
            Kan social media content niet laden: {error.message}
          </p>
          <button
            onClick={() => refetch()}
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
              <div className="bg-premium-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    console.log('No posts found, showing empty state');
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="headline-premium text-headline-lg text-az-black dark:text-white font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-az-red" />
            AZ Supporters delen
          </h2>
        </div>
        
        <div className="card-premium dark:bg-gray-800 p-8 text-center">
          <p className="body-premium text-body-lg text-premium-gray-600 dark:text-gray-300">
            Geen recente social media posts gevonden. Probeer later opnieuw.
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-az-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 mx-auto mt-4"
          >
            <RefreshCw className="w-4 h-4" />
            Vernieuw
          </button>
        </div>
      </section>
    );
  }

  console.log(`Rendering ${posts.length} social media posts`);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="headline-premium text-headline-lg text-az-black dark:text-white font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-az-red" />
          AZ Supporters delen
        </h2>
        <button
          onClick={() => refetch()}
          className="text-az-red hover:text-red-700 p-2 rounded-lg hover:bg-premium-gray-50 dark:hover:bg-gray-800 transition-colors"
          title="Vernieuw social media posts"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      {/* Vertical list voor mobile-first */}
      <div className="space-y-4">
        {posts.slice(0, 6).map((post, index) => {
          console.log('Rendering post:', post.id, post.platform);
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
      
      {posts.length > 6 && (
        <div className="text-center mt-6">
          <p className="text-sm text-premium-gray-500 dark:text-gray-400">
            Toont de laatste 6 posts • Vernieuw voor meer content
          </p>
        </div>
      )}
    </section>
  );
};
