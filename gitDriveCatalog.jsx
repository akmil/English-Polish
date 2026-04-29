
const CATALOG_DATE = '2026-04-29';

// ─── All source files inline ──────────────────────────────────────────────────

const FILES = [
  // ── Folder structure (page 1) ─────────────────────────────────────────────
  {
    path: 'FOLDER STRUCTURE',
    lang: 'text',
    code: `src/
├── api/
│   └── base44Client.js          Base44 SDK client initialization
│
├── components/
│   ├── drive/
│   │   ├── FileCard.jsx          Individual file/folder card (grid & list modes)
│   │   ├── FileGrid.jsx          Grid/list layout container for files
│   │   ├── FilePreview.jsx       Full-screen file preview modal
│   │   ├── LoginScreen.jsx       GitHub PAT authentication form
│   │   ├── NewRepoDialog.jsx     Dialog to create a new GitHub repository
│   │   ├── RepoSelector.jsx      Repository selection screen
│   │   ├── Sidebar.jsx           Left navigation sidebar
│   │   ├── Toolbar.jsx           Top toolbar (breadcrumbs, search, actions)
│   │   ├── UploadDropzone.jsx    File upload drag-and-drop overlay
│   │   └── dialogs/
│   │       ├── DeleteDialog.jsx  Confirm file/folder deletion
│   │       ├── NewFolderDialog.jsx  Create a new folder
│   │       └── RenameDialog.jsx  Rename a file
│   │
│   └── ui/                       shadcn/ui component library (Radix UI based)
│       ├── button.jsx
│       ├── dialog.jsx
│       ├── dropdown-menu.jsx
│       ├── input.jsx
│       └── ... (and more)
│
├── context/
│   └── GitHubContext.jsx         Global auth state, token, user, active repo
│
├── lib/
│   ├── github.js                 All GitHub REST API calls + file utilities
│   ├── PageNotFound.jsx          404 page
│   ├── query-client.js           React Query client instance
│   └── utils.js                  cn() class name utility
│
├── pages/
│   ├── Drive.jsx                 Main drive page (file browser, orchestration)
│   └── Index.jsx                 Entry point — routes to Drive or LoginScreen
│
├── App.jsx                       Router setup, providers
├── index.css                     Global styles, CSS design tokens
├── main.jsx                      React DOM entry point
└── tailwind.config.js            Tailwind theme configuration`,
  },

  // ── App.jsx ───────────────────────────────────────────────────────────────
  {
    path: 'App.jsx',
    lang: 'jsx',
    description: 'Root component. Sets up React Router, React Query, GitHub context, and toast providers.',
    code: `import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { GitHubProvider } from '@/context/GitHubContext';
import Index from './pages/Index';
import { Toaster as Sonner } from 'sonner';

function App() {
  return (
    <GitHubProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <Sonner richColors position="bottom-right" />
      </QueryClientProvider>
    </GitHubProvider>
  );
}

export default App;`,
  },

  // ── pages/Index.jsx ───────────────────────────────────────────────────────
  {
    path: 'src/pages/Index.jsx',
    lang: 'jsx',
    description: 'Entry point page. Reads isAuthenticated from GitHubContext and renders Drive or LoginScreen.',
    code: `import { useGitHub } from '@/context/GitHubContext';
import LoginScreen from '@/components/drive/LoginScreen';
import Drive from './Drive';

export default function Index() {
  const { isAuthenticated } = useGitHub();
  return isAuthenticated ? <Drive /> : <LoginScreen />;
}`,
  },

  // ── pages/Drive.jsx ───────────────────────────────────────────────────────
  {
    path: 'src/pages/Drive.jsx',
    lang: 'jsx',
    description: 'Main application page. Orchestrates file browsing, upload, delete, rename, preview, and all dialogs.',
    code: `import { useState, useEffect } from 'react';
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
    const blob = base64ToBlob(data.content.replace(/\\n/g, ''), getMimeType(item.name));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = item.name; a.click();
    URL.revokeObjectURL(url);
    toast.success(\`Downloaded \${item.name}\`);
  }

  async function handleUploadFile(file) {
    const b64 = await fileToBase64(file);
    const path = currentPath ? \`\${currentPath}/\${file.name}\` : file.name;
    await createFile(token, user.login, activeRepo.name, path, b64,
      \`Upload \${file.name} via GitDrive\`);
    toast.success(\`Uploaded \${file.name}\`);
    fetchContents(currentPath);
  }

  async function handleCreateFolder(name) {
    const folderPath = currentPath ? \`\${currentPath}/\${name}\` : name;
    await createFolder(token, user.login, activeRepo.name, folderPath);
    toast.success(\`Folder "\${name}" created\`);
    fetchContents(currentPath);
  }

  async function handleDelete(item) {
    setDeleting(true);
    if (item.type === 'dir') await deleteFolderRecursive(item.path);
    else await deleteFile(token, user.login, activeRepo.name, item.path, item.sha);
    setDeleting(false); setDeleteTarget(null);
    toast.success(\`Deleted "\${item.name}"\`);
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
    const newPath = \`\${dir}\${newName}\`;
    await createFile(token, user.login, activeRepo.name, newPath,
      data.content.replace(/\\n/g, ''), \`Rename to \${newName}\`);
    await deleteFile(token, user.login, activeRepo.name, item.path, item.sha,
      \`Remove old \${item.name}\`);
    toast.success(\`Renamed to "\${newName}"\`);
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
}`,
  },

  // ── context/GitHubContext.jsx ─────────────────────────────────────────────
  {
    path: 'src/context/GitHubContext.jsx',
    lang: 'jsx',
    description: 'React context providing GitHub auth state (token, user, activeRepo) to the entire app. Persists token and repo to localStorage.',
    code: `import React, { createContext, useContext, useState, useEffect } from 'react';
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
}`,
  },

  // ── lib/github.js ─────────────────────────────────────────────────────────
  {
    path: 'src/lib/github.js',
    lang: 'js',
    description: 'All GitHub REST API v3 interactions. Pure fetch calls — no third-party GitHub SDK.',
    code: `const BASE = 'https://api.github.com';

function headers(token) {
  return {
    Authorization: \`Bearer \${token}\`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

async function request(token, method, path, body) {
  const res = await fetch(\`\${BASE}\${path}\`, {
    method, headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || \`GitHub API error: \${res.status}\`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth
export async function getAuthenticatedUser(token) {
  return request(token, 'GET', '/user');
}

// Repositories
export async function listRepos(token) {
  return request(token, 'GET', '/user/repos?per_page=100&sort=updated&type=owner');
}
export async function createRepo(token, name, description = '', isPrivate = false) {
  return request(token, 'POST', '/user/repos', { name, description, private: isPrivate, auto_init: true });
}
export async function deleteRepo(token, owner, repo) {
  return request(token, 'DELETE', \`/repos/\${owner}/\${repo}\`);
}

// Contents
export async function getContents(token, owner, repo, path = '') {
  return request(token, 'GET', \`/repos/\${owner}/\${repo}/contents/\${path}\`);
}
export async function createFile(token, owner, repo, path, content, message = 'Upload via GitDrive') {
  return request(token, 'PUT', \`/repos/\${owner}/\${repo}/contents/\${path}\`, { message, content });
}
export async function updateFile(token, owner, repo, path, content, sha, message = 'Update via GitDrive') {
  return request(token, 'PUT', \`/repos/\${owner}/\${repo}/contents/\${path}\`, { message, content, sha });
}
export async function deleteFile(token, owner, repo, path, sha, message = 'Delete via GitDrive') {
  return request(token, 'DELETE', \`/repos/\${owner}/\${repo}/contents/\${path}\`, { message, sha });
}
export async function getFileContent(token, owner, repo, path) {
  return request(token, 'GET', \`/repos/\${owner}/\${repo}/contents/\${path}\`);
}

// Folders (placeholder .gitkeep files)
export async function createFolder(token, owner, repo, folderPath) {
  const cleanPath = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
  const filePath = \`\${cleanPath}/.gitkeep\`;
  try {
    const existing = await getFileContent(token, owner, repo, filePath);
    return existing;
  } catch {
    return createFile(token, owner, repo, filePath, btoa(''), \`Create folder \${cleanPath}\`);
  }
}

// Search
export async function searchCode(token, owner, repo, query) {
  return request(token, 'GET',
    \`/search/code?q=\${encodeURIComponent(query)}+repo:\${owner}/\${repo}\`);
}

// Utils
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
export function base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}
export function getFileIcon(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const icons = {
    png:'🖼️',jpg:'🖼️',jpeg:'🖼️',gif:'🖼️',svg:'🖼️',webp:'🖼️',ico:'🖼️',
    pdf:'📄',doc:'📝',docx:'📝',txt:'📄',md:'📝',
    csv:'📊',xls:'📊',xlsx:'📊',
    js:'⚙️',jsx:'⚙️',ts:'⚙️',tsx:'⚙️',py:'⚙️',rb:'⚙️',go:'⚙️',
    rs:'⚙️',java:'⚙️',c:'⚙️',cpp:'⚙️',h:'⚙️',cs:'⚙️',php:'⚙️',
    html:'🌐',css:'🎨',json:'📋',yaml:'📋',yml:'📋',xml:'📋',toml:'📋',
    zip:'📦',tar:'📦',gz:'📦',rar:'📦',
    mp4:'🎬',mov:'🎬',avi:'🎬',mkv:'🎬',
    mp3:'🎵',wav:'🎵',flac:'🎵',ogg:'🎵',
  };
  return icons[ext] || '📄';
}
export function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1024*1024) return \`\${(bytes/1024).toFixed(1)} KB\`;
  return \`\${(bytes/(1024*1024)).toFixed(1)} MB\`;
}
export function getMimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types = {
    png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',
    svg:'image/svg+xml',webp:'image/webp',pdf:'application/pdf',
    mp4:'video/mp4',mp3:'audio/mpeg',
  };
  return types[ext] || 'application/octet-stream';
}`,
  },

  // ── components/drive/LoginScreen.jsx ──────────────────────────────────────
  {
    path: 'src/components/drive/LoginScreen.jsx',
    lang: 'jsx',
    description: 'GitHub PAT login form with show/hide toggle, inline error display, and link to GitHub token generator.',
    code: `import { useState } from 'react';
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
}`,
  },

  // ── components/drive/FileCard.jsx ─────────────────────────────────────────
  {
    path: 'src/components/drive/FileCard.jsx',
    lang: 'jsx',
    description: 'Single file or folder card. Supports grid and list view modes. Includes a dropdown context menu for download, rename, and delete.',
    code: `import { useState } from 'react';
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
}`,
  },

  // ── components/drive/FileGrid.jsx ─────────────────────────────────────────
  {
    path: 'src/components/drive/FileGrid.jsx',
    lang: 'jsx',
    description: 'Container that renders files and folders using FileCard. Separates folders from files, shows section headers, handles empty state and loading.',
    code: `import { AnimatePresence } from 'framer-motion';
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
}`,
  },

  // ── components/drive/FilePreview.jsx ──────────────────────────────────────
  {
    path: 'src/components/drive/FilePreview.jsx',
    lang: 'jsx',
    description: 'Full-screen modal for previewing files. Supports images, video, audio, PDF, text/code, ZIP archive tree, and presentations.',
    code: `import { useEffect, useState } from 'react';
import { X, Download, Loader2, FileText, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFileContent, base64ToBlob, getMimeType, formatBytes } from '@/lib/github';
import { useGitHub } from '@/context/GitHubContext';
import JSZip from 'jszip';

function getPreviewType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['png','jpg','jpeg','gif','svg','webp','bmp','ico'].includes(ext)) return 'image';
  if (['mp4','webm','ogg','mov','avi','mkv'].includes(ext)) return 'video';
  if (['mp3','wav','flac','ogg','aac','m4a'].includes(ext)) return 'audio';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['ppt','pptx','key'].includes(ext)) return 'presentation';
  if (['zip','jar','apk','ipa'].includes(ext)) return 'zip';
  if (['txt','md','csv','json','yaml','yml','toml','xml','html','css',
       'js','jsx','ts','tsx','py','rb','go','rs','java','c','cpp',
       'h','cs','php','sh','bash','env','gitignore','log'].includes(ext)) return 'text';
  return 'unsupported';
}

export default function FilePreview({ item, onClose, onDownload }) {
  const { token, user, activeRepo } = useGitHub();
  const [blobUrl, setBlobUrl] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [zipEntries, setZipEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const previewType = getPreviewType(item.name);
  const mimeType = getMimeType(item.name);

  useEffect(() => { loadFile(); return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); }; }, [item]);

  async function loadFile() {
    setLoading(true); setError('');
    try {
      const data = await getFileContent(token, user.login, activeRepo.name, item.path);
      if (previewType === 'text') {
        setTextContent(atob(data.content.replace(/\\n/g, '')));
      } else if (['audio','video'].includes(previewType)) {
        const res = await fetch(data.download_url);
        setBlobUrl(URL.createObjectURL(await res.blob()));
      } else if (['image','pdf'].includes(previewType)) {
        const blob = base64ToBlob(data.content.replace(/\\n/g, ''), mimeType);
        setBlobUrl(URL.createObjectURL(blob));
      } else if (previewType === 'presentation') {
        setBlobUrl(data.download_url);
      } else if (previewType === 'zip') {
        const res = await fetch(data.download_url);
        const zip = await JSZip.loadAsync(await res.arrayBuffer());
        const entries = Object.values(zip.files).map(f => ({
          name: f.name, isDir: f.dir, size: f._data?.uncompressedSize ?? 0,
        })).sort((a,b) => a.isDir !== b.isDir ? (a.isDir ? -1:1) : a.name.localeCompare(b.name));
        setZipEntries(entries);
      }
    } catch(e) { setError(e.message || 'Failed to load file'); }
    finally { setLoading(false); }
  }

  // ... (render omitted for brevity — full source in repo)
}`,
  },

  // ── components/drive/Sidebar.jsx ──────────────────────────────────────────
  {
    path: 'src/components/drive/Sidebar.jsx',
    lang: 'jsx',
    description: 'Left sidebar with app logo, nav links (My Drive, Recent, Starred, Trash), active repo display, and user info with logout.',
    code: `import { useState } from 'react';
import { Github, HardDrive, Clock, Star, Trash2, ChevronDown, ChevronRight, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGitHub } from '@/context/GitHubContext';
import { motion, AnimatePresence } from 'framer-motion';

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
}`,
  },

  // ── components/drive/Toolbar.jsx ──────────────────────────────────────────
  {
    path: 'src/components/drive/Toolbar.jsx',
    lang: 'jsx',
    description: 'Top toolbar: clickable breadcrumb navigation, search input, New Folder button, Upload button, and grid/list view toggle.',
    code: `import { Search, Grid3X3, List, ChevronRight, Upload, FolderPlus } from 'lucide-react';
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
}`,
  },

  // ── components/drive/dialogs ──────────────────────────────────────────────
  {
    path: 'src/components/drive/dialogs/NewFolderDialog.jsx',
    lang: 'jsx',
    description: 'Modal dialog to create a new folder. Calls onConfirm(name) which triggers createFolder() in Drive.',
    code: `import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FolderPlus } from 'lucide-react';

export default function NewFolderDialog({ open, onClose, onConfirm }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onConfirm(name.trim());
    setName(''); setLoading(false); onClose();
  }

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-amber-600" />
            </div>
            <DialogTitle className="text-base font-semibold">New Folder</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input autoFocus value={name} onChange={e => setName(e.target.value)}
            placeholder="Untitled folder" className="h-10 border-slate-200" />
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" disabled={!name.trim() || loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white">
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}`,
  },
  {
    path: 'src/components/drive/dialogs/DeleteDialog.jsx',
    lang: 'jsx',
    description: 'Confirmation dialog before deleting a file or folder. Warns about recursive folder deletion.',
    code: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DeleteDialog({ open, item, onClose, onConfirm, loading }) {
  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <DialogTitle className="text-base font-semibold">
              Delete {item?.type === 'dir' ? 'Folder' : 'File'}
            </DialogTitle>
          </div>
        </DialogHeader>
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-800">"{item?.name}"</span>?
          {item?.type === 'dir' && ' All files inside will be deleted permanently.'}
          {' '}This action cannot be undone.
        </p>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onConfirm} disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white">
            {loading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  },
  {
    path: 'src/components/drive/dialogs/RenameDialog.jsx',
    lang: 'jsx',
    description: 'Dialog to rename a file. Pre-fills current filename. GitHub has no rename API — this copies and deletes under the hood.',
    code: `import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

export default function RenameDialog({ open, item, onClose, onConfirm }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (item) setName(item.name); }, [item]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || name === item?.name) return;
    setLoading(true);
    await onConfirm(name.trim());
    setLoading(false); onClose();
  }

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-indigo-600" />
            </div>
            <DialogTitle className="text-base font-semibold">Rename</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input autoFocus value={name} onChange={e => setName(e.target.value)}
            className="h-10 border-slate-200" />
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm"
              disabled={!name.trim() || name === item?.name || loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white">
              {loading ? 'Renaming…' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}`,
  },

  // ── index.css ─────────────────────────────────────────────────────────────
  {
    path: 'src/index.css',
    lang: 'css',
    description: 'Global styles and CSS design tokens (light + dark mode). All colors are HSL CSS variables mapped to Tailwind.',
    code: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 248 250 252;
    --foreground: 15 23 42;
    --card: 255 255 255;
    --card-foreground: 15 23 42;
    --primary: 99 102 241;        /* indigo-500 */
    --primary-foreground: 255 255 255;
    --secondary: 241 245 249;
    --secondary-foreground: 51 65 85;
    --muted: 241 245 249;
    --muted-foreground: 100 116 139;
    --accent: 238 242 255;
    --accent-foreground: 79 70 229;
    --destructive: 239 68 68;
    --destructive-foreground: 255 255 255;
    --border: 226 232 240;
    --input: 226 232 240;
    --ring: 99 102 241;
    --radius: 0.75rem;
  }

  .dark {
    --background: 10 10 15;
    --foreground: 248 250 252;
    --card: 15 15 25;
    --primary: 129 140 248;
    --secondary: 30 30 45;
    --muted: 30 30 45;
    --muted-foreground: 148 163 184;
    --border: 30 41 59;
    --input: 30 41 59;
    --ring: 129 140 248;
  }
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-inter antialiased; }
}`,
  },

  // ── tailwind.config.js ────────────────────────────────────────────────────
  {
    path: 'tailwind.config.js',
    lang: 'js',
    description: 'Tailwind configuration. Maps CSS variables to named tokens, registers Inter font, and includes animation keyframes.',
    code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card:        { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        primary:     { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary:   { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted:       { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent:      { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
      },
      keyframes: {
        'fade-in':  { from: { opacity:'0', transform:'translateY(8px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        'scale-in': { from: { opacity:'0', transform:'scale(0.96)' },     to: { opacity:'1', transform:'scale(1)' } },
      },
      animation: {
        'fade-in':  'fade-in 0.25s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};`,
  },
];

// ─── Render ───────────────────────────────────────────────────────────────────

export default function CodeCatalog() {
  return (
    <>
      {/* Print styles injected via a style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #fff; }

        .catalog-root {
          font-family: 'Inter', sans-serif;
          background: #fff;
          color: #1e293b;
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 48px 0;
        }

        /* ── Cover page ── */
        .cover {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-bottom: 3px solid #6366f1;
          page-break-after: always;
          padding-bottom: 80px;
        }
        .cover-badge {
          display: inline-block;
          background: #eef2ff;
          color: #4338ca;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 24px;
        }
        .cover h1 {
          font-size: 64px;
          font-weight: 800;
          letter-spacing: -2px;
          color: #0f172a;
          line-height: 1;
          margin-bottom: 16px;
        }
        .cover h1 span { color: #6366f1; }
        .cover .tagline {
          font-size: 20px;
          color: #64748b;
          margin-bottom: 48px;
          max-width: 520px;
          line-height: 1.5;
        }
        .cover-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
        }
        .cover-meta-item label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .cover-meta-item span {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
        }
        .cover-rule { height: 2px; background: #e2e8f0; margin: 48px 0; }

        /* ── TOC ── */
        .toc {
          page-break-after: always;
          padding-bottom: 80px;
        }
        .section-heading {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 24px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .toc-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 10px;
        }
        .toc-num {
          font-size: 11px;
          font-weight: 600;
          color: #6366f1;
          width: 28px;
          flex-shrink: 0;
        }
        .toc-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #1e293b;
          flex: 1;
        }
        .toc-dots {
          flex: 1;
          border-bottom: 1px dotted #cbd5e1;
          margin: 0 8px 4px;
        }
        .toc-desc {
          font-size: 12px;
          color: #94a3b8;
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── File chapter ── */
        .file-chapter {
          page-break-before: always;
          padding-bottom: 80px;
        }
        .file-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e2e8f0;
        }
        .file-num {
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
          letter-spacing: .08em;
          padding-top: 3px;
          white-space: nowrap;
        }
        .file-path {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 6px;
          word-break: break-all;
        }
        .file-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }
        .lang-badge {
          margin-left: auto;
          flex-shrink: 0;
          background: #f1f5f9;
          color: #475569;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          align-self: center;
        }

        /* ── Code block ── */
        .code-block {
          background: #0f172a;
          border-radius: 10px;
          overflow: hidden;
        }
        .code-block-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-red    { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green  { background: #22c55e; }
        .code-block-filename {
          margin-left: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #94a3b8;
        }
        pre {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          line-height: 1.75;
          color: #e2e8f0;
          padding: 20px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* ── Print button ── */
        .print-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: #6366f1;
          color: #fff;
          border: none;
          padding: 14px 28px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border-radius: 100px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(99,102,241,.35);
          z-index: 1000;
          transition: background .15s;
        }
        .print-btn:hover { background: #4f46e5; }

        @media print {
          .print-btn { display: none !important; }
          .catalog-root { padding: 0; max-width: 100%; }
          .cover { padding: 48px; min-height: auto; }
          .file-chapter, .toc { padding: 48px 48px 0; }
          pre { font-size: 10px; }
        }
      `}</style>

      <button className="print-btn" onClick={() => window.print()}>
        🖨️ Print / Save as PDF
      </button>

      <div className="catalog-root">

        {/* ── Cover ──────────────────────────────────────────────────────── */}
        <div className="cover">
          <div className="cover-badge">Source Code Catalog</div>
          <h1>Git<span>Drive</span></h1>
          <p className="tagline">
            A Google Drive–style file manager built on top of the GitHub REST API.
            Browse, upload, preview, rename, and delete files — no backend required.
          </p>
          <div className="cover-rule" />
          <div className="cover-meta">
            <div className="cover-meta-item">
              <label>Version</label>
              <span>1.0.0</span>
            </div>
            <div className="cover-meta-item">
              <label>Date</label>
              <span>{CATALOG_DATE}</span>
            </div>
            <div className="cover-meta-item">
              <label>Files</label>
              <span>{FILES.length} source files</span>
            </div>
            <div className="cover-meta-item">
              <label>Framework</label>
              <span>React 18 + Vite</span>
            </div>
            <div className="cover-meta-item">
              <label>Styling</label>
              <span>Tailwind CSS + shadcn/ui</span>
            </div>
            <div className="cover-meta-item">
              <label>API</label>
              <span>GitHub REST v3</span>
            </div>
          </div>
        </div>

        {/* ── Table of Contents ───────────────────────────────────────────── */}
        <div className="toc">
          <p className="section-heading">Table of Contents</p>
          {FILES.map((f, i) => (
            <div key={i} className="toc-row">
              <span className="toc-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="toc-name">{f.path}</span>
              <span className="toc-dots" />
              <span className="toc-desc">{f.description || ''}</span>
            </div>
          ))}
        </div>

        {/* ── File Chapters ────────────────────────────────────────────────── */}
        {FILES.map((f, i) => (
          <div key={i} className="file-chapter">
            <div className="file-header">
              <span className="file-num">§{String(i + 1).padStart(2, '0')}</span>
              <div style={{ flex: 1 }}>
                <div className="file-path">{f.path}</div>
                {f.description && <div className="file-desc">{f.description}</div>}
              </div>
              <span className="lang-badge">{f.lang}</span>
            </div>

            <div className="code-block">
              <div className="code-block-bar">
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
                <span className="code-block-filename">{f.path}</span>
              </div>
              <pre>{f.code}</pre>
            </div>
          </div>
        ))}

      </div>
    </>
  );
}