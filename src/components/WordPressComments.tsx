
import React, { useState } from 'react';
import { MessageCircle, Users, SortAsc, SortDesc, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComments } from '@/hooks/useComments';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';

interface WordPressCommentsProps {
  articleId: string;
  title: string;
}

export const WordPressComments = ({ articleId, title }: WordPressCommentsProps) => {
  const { comments, isLoading } = useComments(articleId);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most_liked'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const filteredAndSortedComments = React.useMemo(() => {
    let filtered = comments;

    // Filter by search term
    if (searchTerm) {
      filtered = comments.filter(comment =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort comments
    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'most_liked':
          return b.likes_count - a.likes_count;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [comments, searchTerm, sortOrder]);

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="headline-premium text-headline-lg text-az-black dark:text-white flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-az-red" />
          Reacties
          <span className="text-sm bg-az-red text-white px-2 py-1 rounded-full font-medium">
            {totalComments}
          </span>
        </h3>
        
        <Button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="bg-az-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Reageren
        </Button>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-premium-gray-200 dark:border-gray-700 p-6">
          <h4 className="headline-premium text-headline-md mb-4 text-az-black dark:text-white">
            Deel je mening
          </h4>
          <CommentForm
            articleId={articleId}
            onSuccess={() => setShowCommentForm(false)}
          />
        </div>
      )}

      {/* Controls */}
      {comments.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-premium-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 text-premium-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {totalComments} reactie{totalComments !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-gray-400" />
              <Input
                placeholder="Zoek in reacties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-48 bg-white dark:bg-gray-700 border-premium-gray-300 dark:border-gray-600"
              />
            </div>
            
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-700 border-premium-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <SortDesc className="w-4 h-4" />
                    Nieuwste
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4" />
                    Oudste
                  </div>
                </SelectItem>
                <SelectItem value="most_liked">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Meest geliked
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-az-red mx-auto"></div>
          <p className="mt-4 body-premium text-premium-gray-600 dark:text-gray-400">
            Reacties laden...
          </p>
        </div>
      ) : filteredAndSortedComments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-premium-gray-200 dark:border-gray-700">
          <MessageCircle className="w-16 h-16 text-premium-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h4 className="headline-premium text-headline-md mb-2 text-premium-gray-600 dark:text-gray-400">
            {searchTerm ? 'Geen reacties gevonden' : 'Nog geen reacties'}
          </h4>
          <p className="body-premium text-body-md text-premium-gray-500 dark:text-gray-500 mb-6">
            {searchTerm 
              ? 'Probeer een andere zoekterm.' 
              : 'Wees de eerste om te reageren op dit artikel!'
            }
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setShowCommentForm(true)}
              className="bg-az-red hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Eerste reactie plaatsen
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              articleId={articleId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
