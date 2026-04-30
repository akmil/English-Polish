// @ts-nocheck
// @ts-nocheck
import { useState, useEffect } from 'react';
import { useGitHub } from '@/context/GitHubContext';
import {
  getContents, createFolder, createFile, deleteFile,
  getFileContent, fileToBase64, base64ToBlob, getMimeType,
} from '@/lib/github';
import Sidebar from '@/components/drive/Sidebar';
import Toolbar from '@/components/drive/Toolbar';
import FileGrid from '@/components/drive/FileGrid';
import RepoSelector from '@/components/drive/RepoSelector';
import UploadDropzone from '@/components/drive/UploadDropzone';
import NewFolderDialog from '@/components/drive/dialogs/NewFolderDialog';
import DeleteDialog from '@/components/drive/dialogs/DeleteDialog';
import RenameDialog from '@/components/drive/dialogs/RenameDialog';
import NewRepoDialog from '@/components/drive/NewRepoDialog';
import FilePreview from '@/components/drive/FilePreview';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

export default function Drive() {
  const { token, user, activeRepo, setActiveRepo } = useGitHub();

  const [section, setSection] = useState('my-drive');
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showNewRepo, setShowNewRepo] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (activeRepo && section === 'my-drive') fetchContents(currentPath);
  }, [activeRepo, currentPath, section]);

  async function fetchContents(path = '') {
    setLoading(true);
    const data = await getContents(token, user.login, activeRepo.name, path);
    setItems(Array.isArray(data) ? data : [data]);
    setLoading(false);
  }

  const breadcrumbs = ['My Drive'];
  if (activeRepo) breadcrumbs.push(activeRepo.name);
  if (currentPath) currentPath.split('/').forEach(p => breadcrumbs.push(p));

  function handleBreadcrumbClick(index) {
    if (index === 0) { setActiveRepo(null); setCurrentPath(''); return; }
    if (index === 1) { setCurrentPath(''); return; }
    const parts = currentPath.split('/');
    setCurrentPath(parts.slice(0, index - 1).join('/'));
  }

  function handleOpen(item) {
    if (item.type === 'dir') setCurrentPath(item.path);
    else setPreviewItem(item);
  }

  async function handleDownload(item) {
    const data = await getFileContent(token, user.login, activeRepo.name, item.path);
    const blob = base64ToBlob(data.content.replace(/\n/g, ''), getMimeType(item.name));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = item.name; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${item.name}`);
  }

  async function handleUploadFile(file) {
    const b64 = await fileToBase64(file);
    const path = currentPath ? `${currentPath}/${file.name}` : file.name;
    await createFile(token, user.login, activeRepo.name, path, b64,
      `Upload ${file.name} via GitDrive`);
    toast.success(`Uploaded ${file.name}`);
    fetchContents(currentPath);
  }

  async function handleCreateFolder(name) {
    const folderPath = currentPath ? `${currentPath}/${name}` : name;
    await createFolder(token, user.login, activeRepo.name, folderPath);
    toast.success(`Folder "${name}" created`);
    fetchContents(currentPath);
  }

  async function handleDelete(item) {
    setDeleting(true);
    if (item.type === 'dir') await deleteFolderRecursive(item.path);
    else await deleteFile(token, user.login, activeRepo.name, item.path, item.sha);
    setDeleting(false); setDeleteTarget(null);
    toast.success(`Deleted "${item.name}"`);
    fetchContents(currentPath);
  }

  async function deleteFolderRecursive(folderPath) {
    const contents = await getContents(token, user.login, activeRepo.name, folderPath);
    const files = Array.isArray(contents) ? contents : [contents];
    for (const f of files) {
      if (f.type === 'dir') await deleteFolderRecursive(f.path);
      else await deleteFile(token, user.login, activeRepo.name, f.path, f.sha);
    }
  }

  async function handleRename(newName) {
    const item = renameTarget;
    if (!item || item.type === 'dir') {
      toast.error('Folder renaming not supported via GitHub API'); return;
    }
    const data = await getFileContent(token, user.login, activeRepo.name, item.path);
    const dir = item.path.includes('/') ? item.path.substring(0, item.path.lastIndexOf('/') + 1) : '';
    const newPath = `${dir}${newName}`;
    await createFile(token, user.login, activeRepo.name, newPath,
      data.content.replace(/\n/g, ''), `Rename to ${newName}`);
    await deleteFile(token, user.login, activeRepo.name, item.path, item.sha,
      `Remove old ${item.name}`);
    toast.success(`Renamed to "${newName}"`);
    fetchContents(currentPath);
  }

  const filteredItems = searchQuery
    ? items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  if (!activeRepo || section !== 'my-drive') {
    return (
      <div className="flex h-screen bg-background font-inter overflow-hidden">
        <Sidebar activeSection={section} onSectionChange={setSection}
          onNewRepo={() => setShowNewRepo(true)} />
        {section !== 'my-drive'
          ? <div className="flex-1 flex items-center justify-center text-slate-400">
              <p>{section} — coming soon</p>
            </div>
          : <RepoSelector onSelect={repo => { setActiveRepo(repo); setCurrentPath(''); }} />
        }
        <NewRepoDialog open={showNewRepo} onClose={() => setShowNewRepo(false)}
          onCreated={r => { setActiveRepo(r); setSection('my-drive'); }} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background font-inter overflow-hidden">
      <Sidebar activeSection={section} onSectionChange={setSection}
        onNewRepo={() => setShowNewRepo(true)}
        onNewFolder={() => setShowNewFolder(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Toolbar breadcrumbs={breadcrumbs} onBreadcrumbClick={handleBreadcrumbClick}
          viewMode={viewMode} onViewModeChange={setViewMode}
          searchQuery={searchQuery} onSearchChange={setSearchQuery}
          onUpload={() => setShowUpload(true)} onNewFolder={() => setShowNewFolder(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <FileGrid items={filteredItems} loading={loading} viewMode={viewMode}
            onOpen={handleOpen} onDelete={item => setDeleteTarget(item)}
            onDownload={handleDownload} onRename={item => setRenameTarget(item)}
            onStar={() => toast('Star coming soon')} />
        </main>
      </div>
      <AnimatePresence>
        {showUpload && <UploadDropzone onUpload={handleUploadFile}
          onClose={() => { setShowUpload(false); fetchContents(currentPath); }} />}
      </AnimatePresence>
      <NewFolderDialog open={showNewFolder} onClose={() => setShowNewFolder(false)}
        onConfirm={handleCreateFolder} />
      <DeleteDialog open={!!deleteTarget} item={deleteTarget} loading={deleting}
        onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} />
      <RenameDialog open={!!renameTarget} item={renameTarget}
        onClose={() => setRenameTarget(null)} onConfirm={handleRename} />
      <NewRepoDialog open={showNewRepo} onClose={() => setShowNewRepo(false)}
        onCreated={r => { setActiveRepo(r); setCurrentPath(''); setSection('my-drive'); }} />
      {previewItem && <FilePreview item={previewItem}
        onClose={() => setPreviewItem(null)} onDownload={handleDownload} />}
    </div>
  );
}