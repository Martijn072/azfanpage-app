import { MessageSquare, ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ForumDiscussionWidgetProps {
  articleTitle: string;
  articleId: string;
  className?: string;
}

export const ForumDiscussionWidget = ({ 
  articleTitle, 
  articleId, 
  className = "" 
}: ForumDiscussionWidgetProps) => {
  const navigate = useNavigate();

  const handleDiscussInForum = () => {
    // Create URL-friendly slug from article title
    const slug = articleTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    // Navigate to forum with search for this article
    navigate(`/forum#search=${encodeURIComponent(articleTitle)}`);
  };

  const handleStartDiscussion = () => {
    // Navigate to forum to start new discussion about this article
    const newTopicUrl = `/forum#new-topic&title=${encodeURIComponent(`Discussie: ${articleTitle}`)}`;
    navigate(newTopicUrl);
  };

  return (
    <Card className={`border-az-red/20 bg-gradient-to-r from-az-red/5 to-orange-50 dark:from-az-red/10 dark:to-orange-900/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-az-red/10 dark:bg-az-red/20 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-az-red" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-az-black dark:text-white">
              Wat vindt het forum?
            </h3>
            <p className="text-sm text-premium-gray-600 dark:text-gray-400">
              Deel je mening over dit artikel
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleDiscussInForum}
            variant="outline"
            className="w-full justify-between text-az-red border-az-red/30 hover:bg-az-red hover:text-white group"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Bekijk forum discussies
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            onClick={handleStartDiscussion}
            className="w-full bg-az-red hover:bg-red-700 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Start nieuwe discussie
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-az-red/20">
          <p className="text-xs text-premium-gray-500 dark:text-gray-400 text-center">
            Discussieer met andere AZ fans over dit onderwerp
          </p>
        </div>
      </CardContent>
    </Card>
  );
};