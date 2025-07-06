import { useState, useEffect } from "react";
import { MessageSquare, TrendingUp, Clock, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ForumTopic {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastReply: string;
  isHot?: boolean;
  category: string;
}

// Mock data - in real app this would come from API
const mockForumTopics: ForumTopic[] = [
  {
    id: "1",
    title: "Wedstrijdthread: AZ - PSV | Eredivisie",
    author: "AZFan1904",
    replies: 147,
    views: 2543,
    lastReply: "2 min geleden",
    isHot: true,
    category: "Wedstrijden"
  },
  {
    id: "2", 
    title: "Transfer geruchten: Nieuwe aanvaller op komst?",
    author: "TransferExpert",
    replies: 89,
    views: 1876,
    lastReply: "15 min geleden",
    isHot: true,
    category: "Transfers"
  },
  {
    id: "3",
    title: "Seizoenskaart 2024/2025: Ervaringen en tips",
    author: "SeizoenkaartHouder",
    replies: 34,
    views: 672,
    lastReply: "1 uur geleden",
    category: "Algemeen"
  },
  {
    id: "4",
    title: "Youth Academy: Talent voor de toekomst",
    author: "JeugdTrainer",
    replies: 12,
    views: 234,
    lastReply: "3 uur geleden",
    category: "Jeugd"
  }
];

export const ForumWidget = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchTopics = async () => {
      setLoading(true);
      // In real app, this would be an actual API call
      setTimeout(() => {
        setTopics(mockForumTopics.slice(0, 4));
        setLoading(false);
      }, 500);
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicId: string) => {
    // Navigate to forum with specific topic
    navigate(`/forum#topic-${topicId}`);
  };

  const handleViewAllClick = () => {
    navigate('/forum');
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-az-red" />
            <span>Nieuw in Forum</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-premium-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-premium-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-az-red" />
            <span className="text-lg font-bold text-az-black dark:text-white">
              Nieuw in Forum
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAllClick}
            className="text-az-red hover:text-red-700 hover:bg-az-red/10"
          >
            <span className="text-sm">Bekijk alles</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            className="group p-3 rounded-lg border border-premium-gray-200 dark:border-gray-700 hover:border-az-red/30 hover:bg-az-red/5 dark:hover:bg-az-red/10 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-az-red/10 text-az-red hover:bg-az-red/20"
                  >
                    {topic.category}
                  </Badge>
                  {topic.isHot && (
                    <TrendingUp className="w-3 h-3 text-orange-500" />
                  )}
                </div>
                
                <h4 className="font-medium text-sm text-az-black dark:text-white group-hover:text-az-red transition-colors line-clamp-2">
                  {topic.title}
                </h4>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-premium-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {topic.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {topic.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.lastReply}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t border-premium-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleViewAllClick}
            className="w-full text-az-red border-az-red/30 hover:bg-az-red hover:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Bekijk alle discussies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};