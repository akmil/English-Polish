import { AnimatePresence } from 'framer-motion';
import FileCard from './FileCard';
import { Folder, FileText } from 'lucide-react';

export default function FileGrid({ items, onOpen, onDelete, onDownload, onRename, onStar, viewMode, loading }) {
  const visible = items.filter(i => i.name !== '.gitkeep');
  const folders = visible.filter(i => i.type === 'dir');
  const files = visible.filter(i => i.type === 'file');

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (visible.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <FileText className="w-10 h-10 mb-3 opacity-30" />
      <p className="font-medium text-sm">This folder is empty</p>
      <p className="text-xs mt-1">Upload files or create a folder to get started</p>
    </div>
  );

  const cardProps = { onOpen, onDelete, onDownload, onRename, onStar, viewMode };

  if (viewMode === 'list') return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-400
                      uppercase tracking-wider border-b border-slate-100">
        <div className="w-8" /><span className="flex-1">Name</span>
        <span className="w-20 text-right hidden sm:block">Size</span>
        <div className="w-6" />
      </div>
      <AnimatePresence>
        {[...folders, ...files].map(item =>
          <FileCard key={item.sha || item.path} item={item} {...cardProps} />)}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-6">
      {folders.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider
                         mb-3 flex items-center gap-2">
            <Folder className="w-3.5 h-3.5" /> Folders
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            <AnimatePresence>
              {folders.map(item => <FileCard key={item.sha || item.path} item={item} {...cardProps} />)}
            </AnimatePresence>
          </div>
        </div>
      )}
      {files.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider
                         mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Files
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            <AnimatePresence>
              {files.map(item => <FileCard key={item.sha || item.path} item={item} {...cardProps} />)}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}