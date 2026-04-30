import { useState } from 'react';
import { Github, HardDrive, Clock, Star, Trash2, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGitHub } from '@/context/GitHubContext';

const navItems = [
  { id: 'my-drive',  label: 'My Drive', icon: HardDrive },
  { id: 'recent',   label: 'Recent',   icon: Clock },
  { id: 'starred',  label: 'Starred',  icon: Star },
  { id: 'trash',    label: 'Trash',    icon: Trash2 },
];

export default function Sidebar({ activeSection, onSectionChange, onNewRepo, onNewFolder }) {
  const { user, logout, activeRepo } = useGitHub();
  const [storageExpanded, setStorageExpanded] = useState(true);

  return (
    <aside className="w-64 flex-shrink-0 h-screen bg-white border-r border-slate-100 flex flex-col select-none">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600
                          flex items-center justify-center shadow-sm">
            <Github className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">GitDrive</span>
        </div>
      </div>

      {/* New button */}
      <div className="px-4 py-4">
        <button onClick={onNewRepo}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border
                     border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm shadow-sm">
          <Plus className="w-4 h-4 text-indigo-500" /> New
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onSectionChange(id)}
            className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              activeSection === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50')}>
            <Icon className={cn('w-4 h-4', activeSection===id ? 'text-indigo-600' : 'text-slate-400')} />
            {label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <img src={user?.avatar_url} alt={user?.login}
            className="w-7 h-7 rounded-full ring-2 ring-slate-100" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{user?.name || user?.login}</p>
            <p className="text-xs text-slate-400 truncate">@{user?.login}</p>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}