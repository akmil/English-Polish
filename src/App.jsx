// @ts-nocheck
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { GitHubProvider } from '@/context/GitHubContext';
import Index from './pages/Index';
import Catalog from './pages/Catalog';
import { Toaster as Sonner } from 'sonner';

function App() {
  return (
    <GitHubProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <Sonner richColors position="bottom-right" />
      </QueryClientProvider>
    </GitHubProvider>
  );
}

export default App;
