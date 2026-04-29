import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthenticatedUser } from '@/lib/github';

const GitHubContext = createContext(null);

export function GitHubProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('github_token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activeRepo, setActiveRepo] = useState(() => {
    const saved = localStorage.getItem('github_active_repo');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => { if (token) validateToken(token); }, []);

  useEffect(() => {
    if (activeRepo) localStorage.setItem('github_active_repo', JSON.stringify(activeRepo));
    else localStorage.removeItem('github_active_repo');
  }, [activeRepo]);

  async function validateToken(t) {
    setLoading(true); setError('');
    try {
      const u = await getAuthenticatedUser(t);
      setUser(u); setToken(t);
      localStorage.setItem('github_token', t);
    } catch (e) {
      setError('Invalid token. Please check your GitHub Personal Access Token.');
      setToken(''); localStorage.removeItem('github_token'); setUser(null);
    } finally { setLoading(false); }
  }

  function logout() {
    setToken(''); setUser(null); setActiveRepo(null);
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_active_repo');
  }

  return (
    <GitHubContext.Provider value={{
      token, user, loading, error,
      activeRepo, setActiveRepo,
      validateToken, logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const ctx = useContext(GitHubContext);
  if (!ctx) throw new Error('useGitHub must be used within GitHubProvider');
  return ctx;
}