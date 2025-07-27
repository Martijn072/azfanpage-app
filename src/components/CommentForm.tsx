import React, { useState } from 'react';
import { Send, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAddComment } from '@/hooks/useComments';

interface CommentFormProps {
  articleId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  compact?: boolean;
}

export const CommentForm = ({ 
  articleId, 
  parentId, 
  onSuccess, 
  placeholder = "Deel je mening over dit artikel...",
  compact = false 
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const addComment = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      await addComment.mutateAsync({
        articleId,
        commentData: {
          content: content.trim(),
          author_name: name.trim() || 'Anoniem',
          author_email: email.trim() || null,
          parent_id: parentId || null
        }
      });
      
      setContent('');
      setName('');
      setEmail('');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="space-y-4 bg-card rounded-lg p-4 border border-border">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Je naam (optioneel)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-border focus:border-primary"
                maxLength={50}
              />
              <Input
                type="email"
                placeholder="Je e-mail (optioneel)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border focus:border-primary"
                maxLength={100}
              />
            </div>
            
            <div className="relative">
              <Textarea
                placeholder={placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-background border-border focus:border-primary min-h-[100px] resize-none pr-12"
                required
                maxLength={1000}
              />
              <Button
                type="submit"
                disabled={addComment.isPending || !content.trim()}
                className="absolute bottom-3 right-3 h-8 w-8 p-0 rounded-full"
              >
                {addComment.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{content.length}/1000 tekens</span>
              {content.trim() && (
                <span className="text-green-600 dark:text-green-400">
                  Reactie plaatsen
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};