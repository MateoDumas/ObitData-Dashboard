import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { useUIStore } from '@/store/ui.store';
import { useToastStore } from '@/store/toast.store';
import { ToastContainer } from '@/components/ui/Toast';
import '@/styles/globals.css';
import '@/styles/theme.css';

function App() {
  const { theme } = useUIStore();
  const { toasts, removeToast } = useToastStore();

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Get base path for GitHub Pages
  const basePath = import.meta.env.BASE_URL || '/';

  return (
    <BrowserRouter basename={basePath}>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </BrowserRouter>
  );
}

export default App;
