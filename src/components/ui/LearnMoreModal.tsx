import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface LearnMoreModalProps {
  title: string;
  description: string;
  steps: Step[];
  features?: string[];
}

export function LearnMoreModal({ title, description, steps, features }: LearnMoreModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-primary hover:text-primary">
          Learn More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {features && (
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Key Features:</h4>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-accent/20 text-accent-dark border-accent/30">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">How to Use:</h4>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground mb-1">{step.title}</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-card p-4 rounded-lg border border-border">
            <div className="flex items-center space-x-2 text-accent-dark">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Pro Tip</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All features work seamlessly across mobile and desktop devices for maximum convenience.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}