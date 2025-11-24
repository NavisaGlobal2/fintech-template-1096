import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TechScaleNavbar = () => {
  const scrollToHow = () => {
    const element = document.getElementById('how');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">TechScale Accelerate</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={scrollToHow}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            How it works
          </button>
          <Link to="/apply">
            <Button className="rounded-full">Apply Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TechScaleNavbar;
