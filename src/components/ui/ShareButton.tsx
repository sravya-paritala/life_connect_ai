import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function ShareButton({ 
  title, 
  text, 
  url = window.location.href,
  variant = 'outline',
  size = 'default'
}: ShareButtonProps) {
  const { toast } = useToast();
  
  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Success!",
          description: "Shared successfully!",
        });
      } else {
        // Fallback: Copy to clipboard
        const shareText = `${title}\n\n${text}\n\n${url}`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Success!",
          description: "Content copied to clipboard!",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback: Copy to clipboard
        try {
          const shareText = `${title}\n\n${text}\n\n${url}`;
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Success!",
            description: "Content copied to clipboard!",
          });
        } catch {
          toast({
            title: "Error",
            description: "Unable to share content",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleShare}
      className="flex items-center space-x-2"
    >
      <Share2 className="w-4 h-4" />
      <span>Share</span>
    </Button>
  );
}