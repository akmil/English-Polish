import { useState } from 'react';
import { Github, Key, Eye, EyeOff, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGitHub } from '@/context/GitHubContext';
import { motion } from 'framer-motion';

export default function LoginScreen() {
  const { validateToken, loading, error } = useGitHub();
  const [pat, setPat] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pat.trim()) validateToken(pat.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50
                    flex items-center justify-center p-4">
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.4 }} className="w-full max-w-md">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
               bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg mb-4">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">GitDrive</h1>
          <p className="text-slate-500 mt-1 text-sm">Your GitHub repository as a Drive</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Key className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">Personal Access Token</h2>
              <p className="text-xs text-slate-500">Required to access your GitHub repos</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input type={show ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={pat} onChange={e => setPat(e.target.value)}
                className="pr-10 font-mono text-sm h-11 border-slate-200" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.p initial={{ opacity:0, x:-4 }} animate={{ opacity:1, x:0 }}
                className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </motion.p>
            )}

            <Button type="submit" disabled={!pat.trim() || loading}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600
                         hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl">
              {loading
                ? <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                     rounded-full animate-spin" /> Connecting…
                  </span>
                : <span className="flex items-center gap-2">
                    Connect GitHub <ArrowRight className="w-4 h-4" />
                  </span>}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need a token?{' '}
              <a href="https://github.com/settings/tokens/new?scopes=repo,delete_repo"
                target="_blank" rel="noopener noreferrer"
                className="text-indigo-600 font-medium inline-flex items-center gap-1">
                Generate on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Scopes needed: <code>repo</code> <code>delete_repo</code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}