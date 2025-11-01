import { Home, FileText, Phone, FolderOpen, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  {
    icon: FileText,
    label: 'Report Summariser',
    path: '/report-summariser',
    size: 'small'
  },
  {
    icon: Phone,
    label: 'Emergency',
    path: '/emergency',
    size: 'small'
  },
  {
    icon: Home,
    label: 'Home',
    path: '/',
    size: 'large',
    isCenter: true
  },
  {
    icon: FolderOpen,
    label: 'Patient History',
    path: '/patient-history',
    size: 'small'
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
    size: 'small'
  }
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-primary">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-200",
                item.isCenter 
                  ? "w-14 h-14 rounded-full bg-gradient-primary shadow-glow -mt-6" 
                  : "w-12 h-12",
                isActive && !item.isCenter && "text-primary",
                !isActive && !item.isCenter && "text-muted-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "transition-all duration-200",
                  item.isCenter ? "w-6 h-6 text-primary-foreground" : "w-5 h-5",
                  item.isCenter && "drop-shadow-sm"
                )} 
              />
              <span className={cn(
                "text-xs mt-1 font-medium",
                item.isCenter ? "text-primary-foreground" : "",
                !item.isCenter && isActive && "text-primary",
                !item.isCenter && !isActive && "text-muted-foreground"
              )}>
                {item.isCenter ? 'Home' : item.label.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}