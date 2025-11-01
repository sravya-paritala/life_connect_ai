import { Menu, FileText, Phone, FolderOpen, Pill, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const menuItems = [
  {
    icon: FileText,
    title: 'Report Summariser',
    description: 'Upload and get AI-powered summaries of medical reports',
    path: '/report-summariser',
    color: 'text-primary'
  },
  {
    icon: Phone,
    title: 'Emergency Report Transmitter',
    description: 'Quick voice-driven emergency questionnaire',
    path: '/emergency',
    color: 'text-secondary'
  },
  {
    icon: FolderOpen,
    title: 'Patient History Management',
    description: 'Securely store and manage medical records',
    path: '/patient-history',
    color: 'text-accent-dark'
  },
  {
    icon: Pill,
    title: 'Pharmacy Section',
    description: 'Browse medicines, vitamins, and healthcare products',
    path: '/pharmacy',
    color: 'text-secondary'
  },
  {
    icon: BookOpen,
    title: 'Health Library',
    description: 'Explore medical topics, symptoms, and treatments',
    path: '/health-library',
    color: 'text-accent-dark'
  }
];

export function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm shadow-card">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 flex flex-col">
        <SheetHeader className="text-left flex-shrink-0">
          <SheetTitle className="text-xl font-bold text-primary">LifeConnectAI</SheetTitle>
          <SheetDescription>
            Your AI-powered healthcare companion
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto mt-6 space-y-4 pr-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      "p-2 rounded-md bg-gradient-to-br from-muted to-muted/50 group-hover:shadow-sm transition-shadow",
                      item.color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer (non-scrollable) */}
        <div className="mt-4 flex-shrink-0 p-4 rounded-lg bg-gradient-card border border-border">
          <h4 className="font-medium text-foreground mb-2">Need Help?</h4>
          <p className="text-sm text-muted-foreground">
            Learn more about each feature by visiting the respective pages and exploring the "Learn More" sections.
          </p>
        </div>
      </SheetContent>

    </Sheet>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}