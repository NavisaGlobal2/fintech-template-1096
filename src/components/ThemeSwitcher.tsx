
import { Toggle } from '@/components/ui/toggle';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle
      pressed={theme === 'light'}
      onPressedChange={toggleTheme}
      size="sm"
      className="w-8 h-8 sm:w-9 sm:h-9 p-0 shrink-0"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
      ) : (
        <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
      )}
    </Toggle>
  );
};

export default ThemeSwitcher;
