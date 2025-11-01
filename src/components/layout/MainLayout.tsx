import { ReactNode } from 'react';
import { HamburgerMenu } from './HamburgerMenu';
import { BottomNavigation } from './BottomNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <HamburgerMenu />
      
      <main className="pb-20 pt-2"> 
        {children}
      </main>
      
      <BottomNavigation />
    </div>
  );
}