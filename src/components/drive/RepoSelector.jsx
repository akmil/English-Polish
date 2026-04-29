import { useState, useEffect } from 'react';
import { Github, Plus, ChevronRight, Lock, Unlock, RefreshCw } from 'lucide-react';
import { useGitHub } from '@/context/GitHubContext';
import { listRepos, createRepo } from '@/lib/github';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function RepoSelector({ onSelect }) {
  const { token, user } = useGitHub();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => { fetchRepos(); }, []);

  async function fetchRepos() {
    setLoading(true);
    const data = await listRepos(token);
    setRepos(data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const repo = await createRepo(token, newName.trim(), newDesc.trim(), isPrivate);
    setRepos([repo, ...repos]);
    setShowCreate(false);
    setNewName('');
    setNewDesc('');
    onSelect(repo);
    setCreating(false);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Repositories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Select a repository to use as your Drive storage</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchRepos} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
          <Button
            onClick={() => setShowCreate(!showCreate)}
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Repository
          </Button>
        </div>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-100 bg-indigo-50"
          >
            <form onSubmit={handleCreate} className="px-8 py-5 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-48">
                <label className="text-xs font-medium text-slate-600 block mb-1">Repository name *</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="my-drive"
                  className="h-9 bg-white border-slate-200"
                  autoFocus
                />
              </div>
              <div className="flex-1 min-w-48">
                <label className="text-xs font-medium text-slate-600 block mb-1">Description</label>
                <Input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Optional description"
                  className="h-9 bg-white border-slate-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-medium border transition-all',
                    isPrivate
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  )}
                >
                  {isPrivate ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  {isPrivate ? 'Private' : 'Public'}
                </button>
                <Button type="submit" disabled={!newName.trim() || creating} size="sm" className="h-9 bg-indigo-500 hover:bg-indigo-600 text-white">
                  {creating ? 'Creating…' : 'Create'}
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-9" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repo list */}
      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Github className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No repositories yet</p>
            <p className="text-sm mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="grid gap-3 max-w-2xl">
            {repos.map((repo) => (
              <motion.button
                key={repo.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelect(repo)}
                className="group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Github className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{repo.name}</span>
                    {repo.private && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">Private</span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{repo.description}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}