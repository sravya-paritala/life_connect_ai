import { Heart, Stethoscope, Plus } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center space-x-2 fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-card">
      <div className="flex items-center space-x-1">
        {/* L */}
        <div className="text-2xl font-bold text-primary">L</div>
        
        {/* Medical symbol - Cross */}
        <div className="relative">
          <Plus className="w-4 h-4 text-secondary" />
        </div>
        
        {/* C */}
        <div className="text-2xl font-bold text-primary">C</div>
        
        {/* Medical symbol - Stethoscope */}
        <div className="relative">
          <Stethoscope className="w-4 h-4 text-accent-dark" />
        </div>
        
        {/* AI */}
        <div className="text-2xl font-bold text-primary">AI</div>
        
        {/* Medical symbol - Heart */}
        <div className="relative">
          <Heart className="w-4 h-4 text-secondary fill-current" />
        </div>
      </div>
    </div>
  );
}