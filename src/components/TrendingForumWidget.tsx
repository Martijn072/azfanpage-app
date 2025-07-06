import { useState, useEffect } from "react";
import { TrendingUp, MessageSquare, Clock, Eye, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingTopic {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastReply: string;
  category: string;
  trendScore: number;
}

// Mock trending topics data
const mockTrendingTopics: TrendingTopic[] = [
  {
    id: "trending-1",
    title: "🔥 Live: AZ vs Ajax - Wedstrijdthread",
    author: "MatchReporter",
    replies: 234,
    views: 4521,
    lastReply: "Nu",
    category: "Live Wedstrijd",
    trendScore: 95
  },
  {
    id: "trending-2",
    title: "BREAKING: Nieuwe trainer aangekondigd!",
    author: "AZNieuws",
    replies: 156,
    views: 3876,
    lastReply: "5 min geleden",
    category: "Breaking News",
    trendScore: 89
  },
  {
    id: "trending-3",
    title: "Transfer Update: Pavlidis naar Brighton?",
    author: "TransferGuru",
    replies: 98,
    views: 2134,
    lastReply: "12 min geleden",
    category: "Transfers",
    trendScore: 76
  }
];

export const TrendingForumWidget = () => {
  const navigate = useNavigate();
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTrendingTopics(mockTrendingTopics);
        setLoading(false);
      }, 300);
    };

    fetchTrendingTopics();
  }, []);

  const handleTopicClick = (topicId: string) => {
    navigate(`/forum#topic-${topicId}`);
  };

  const getTrendColor = (score: number) => {
    if (score >= 90) return "text-red-500";
    if (score >= 75) return "text-orange-500";
    return "text-yellow-500";
  };

  const getTrendBadgeColor = (category: string) => {
    switch (category) {
      case "Live Wedstrijd":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Breaking News":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "Transfers":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-az-red/10 text-az-red";
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span>Trending Forum</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-premium-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-premium-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <span className="text-lg font-bold text-az-black dark:text-white">
            Trending Forum Discussies
          </span>
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            className="group relative p-3 rounded-lg border border-premium-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer"
          >
            {/* Trending indicator */}
            <div className="absolute -top-1 -right-1">
              <TrendingUp className={`w-4 h-4 ${getTrendColor(topic.trendScore)}`} />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    className={`text-xs ${getTrendBadgeColor(topic.category)}`}
                  >
                    {topic.category}
                  </Badge>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    #{index + 1}
                  </span>
                </div>
                
                <h4 className="font-medium text-sm text-az-black dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2">
                  {topic.title}
                </h4>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-premium-gray-600 dark:text-gray-400">
                  <span>{topic.author}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {topic.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {topic.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.lastReply}
                  </span>
                </div>
              </div>

              {/* Trend score */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-bold ${getTrendColor(topic.trendScore)}`}>
                  {topic.trendScore}%
                </div>
                <div className="text-xs text-premium-gray-500 dark:text-gray-400">
                  hot
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};