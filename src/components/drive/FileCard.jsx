// @ts-nocheck
import { Folder, MoreVertical, Download, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFileIcon, formatBytes } from '@/lib/github';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
         DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

export default function FileCard({ item, onOpen, onDelete, onDownload, onRename, onStar, viewMode='grid' }) {
  const isFolder = item.type === 'dir';
  if (item.name === '.gitkeep') return null;
  const icon = isFolder ? null : getFileIcon(item.name);

  if (viewMode === 'list') {
    return (
      <motion.div initial={{ opacity:0, x:-4 }} animate={{ opacity:1, x:0 }}
        className="group flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50
                   rounded-lg cursor-pointer transition-colors"
        onDoubleClick={() => onOpen(item)}>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isFolder ? 'bg-amber-50' : 'bg-slate-50')}>
          {isFolder ? <Folder className="w-4 h-4 text-amber-500 fill-amber-100" />
                    : <span className="text-base">{icon}</span>}
        </div>
        <span className="flex-1 text-sm font-medium text-slate-700 truncate">{item.name}</span>
        <span className="text-xs text-slate-400 hidden sm:block w-20 text-right">
          {isFolder ? '—' : formatBytes(item.size)}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <FileMenu item={item} onDelete={onDelete} onDownload={onDownload}
            onRename={onRename} isFolder={isFolder} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
      whileHover={{ y:-2 }}
      className="group relative bg-white border border-slate-100 rounded-xl p-4
                 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all"
      onDoubleClick={() => onOpen(item)}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <FileMenu item={item} onDelete={onDelete} onDownload={onDownload}
          onRename={onRename} isFolder={isFolder} />
      </div>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3',
        isFolder ? 'bg-amber-50' : 'bg-slate-50')}>
        {isFolder ? <Folder className="w-6 h-6 text-amber-500 fill-amber-100" />
                  : <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
      {!isFolder && <p className="text-xs text-slate-400 mt-0.5">{formatBytes(item.size)}</p>}
    </motion.div>
  );
}

function FileMenu({ item, onDelete, onDownload, onRename, isFolder }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button onClick={e => e.stopPropagation()}
          className="w-6 h-6 rounded-md flex items-center justify-center
                     hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {!isFolder && (
          <DropdownMenuItem onClick={e => { e.stopPropagation(); onDownload(item); }}>
            <Download className="w-3.5 h-3.5 mr-2" /> Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={e => { e.stopPropagation(); onRename(item); }}>
          <Edit2 className="w-3.5 h-3.5 mr-2" /> Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={e => { e.stopPropagation(); onDelete(item); }}
          className="text-red-600 focus:text-red-600 focus:bg-red-50">
          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}