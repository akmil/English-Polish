import { Search, Grid3X3, List, ChevronRight, Upload, FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Toolbar({ breadcrumbs=[], onBreadcrumbClick, viewMode, onViewModeChange,
  searchQuery, onSearchChange, onUpload, onNewFolder }) {
  return (
    <div className="h-14 border-b border-slate-100 bg-white flex items-center gap-4 px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-sm font-medium flex-1 min-w-0 overflow-hidden">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1 flex-shrink-0">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            <button onClick={() => onBreadcrumbClick?.(i)}
              className={cn('hover:text-indigo-600 transition-colors max-w-[160px] truncate',
                i === breadcrumbs.length-1
                  ? 'text-slate-800 font-semibold pointer-events-none'
                  : 'text-slate-500')}>
              {crumb}
            </button>
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input type="text" placeholder="Search files…" value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="h-8 pl-8 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-200 w-52 placeholder:text-slate-400" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button onClick={onNewFolder}
          className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium
                     text-slate-600 hover:bg-slate-100 border border-slate-200">
          <FolderPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Folder</span>
        </button>
        <button onClick={onUpload}
          className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium
                     text-white bg-indigo-500 hover:bg-indigo-600 shadow-sm">
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 ml-1">
          <button onClick={() => onViewModeChange('grid')}
            className={cn('p-1.5 rounded-md transition-all',
              viewMode==='grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400')}>
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onViewModeChange('list')}
            className={cn('p-1.5 rounded-md transition-all',
              viewMode==='list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400')}>
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}