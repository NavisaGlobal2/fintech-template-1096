
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import TechScaleLogo from "@/components/techscale/TechScaleLogo";
import AuthButton from "@/components/AuthButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex-shrink-0">
            <TechScaleLogo />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('loan-matcher')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => scrollToSection('success-stories')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Success Stories
            </button>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <AuthButton />
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <AuthButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-3 py-3 text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('loan-matcher')}
                className="block w-full text-left px-3 py-3 text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => scrollToSection('success-stories')}
                className="block w-full text-left px-3 py-3 text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                Success Stories
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
