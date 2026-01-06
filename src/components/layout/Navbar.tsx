import { Moon, Sun, Menu } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import clsx from 'clsx';

export interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUIStore();

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
    onMenuClick?.();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ObitData Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <LiveIndicator />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
