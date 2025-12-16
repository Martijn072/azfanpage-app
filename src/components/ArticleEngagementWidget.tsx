import { Link, MessageCircle, Facebook, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Custom X (Twitter) icon
const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ArticleEngagementWidgetProps {
  article: {
    title: string;
    slug: string;
  };
}

export const ArticleEngagementWidget = ({ article }: ArticleEngagementWidgetProps) => {
  const { toast } = useToast();

  const getMainSiteUrl = () => `https://www.azfanpage.nl/${article.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getMainSiteUrl());
      toast({
        title: "Link gekopieerd!",
        description: "De artikel link is gekopieerd naar je klembord.",
      });
    } catch (err) {
      toast({
        title: "Fout",
        description: "Kon de link niet kopiëren.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const url = getMainSiteUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${url}`)}`, '_blank');
  };

  const handleTwitterShare = () => {
    const url = getMainSiteUrl();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="mt-8 p-5 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl">
      <div className="flex flex-col gap-4">
        {/* Share section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Deel dit artikel</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={handleTwitterShare}
              className="p-2.5 rounded-full bg-foreground hover:bg-foreground/80 text-background transition-colors"
              title="X"
            >
              <XIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground transition-colors"
              title="Kopieer link"
            >
              <Link className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Follow section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Volg AZFanpage</p>
          <div className="flex items-center gap-2">
            <a
              href="https://x.com/azfanpage"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-colors"
              title="X"
            >
              <XIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/azfanpage"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-colors"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/azfanpage"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#E4405F]/10 hover:bg-[#E4405F]/20 text-[#E4405F] transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
