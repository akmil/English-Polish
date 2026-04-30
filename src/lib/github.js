// @ts-nocheck
const BASE = 'https://api.github.com';

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

async function request(token, method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method, headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
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
  return request(token, 'DELETE', `/repos/${owner}/${repo}`);
}

// Contents
export async function getContents(token, owner, repo, path = '') {
  return request(token, 'GET', `/repos/${owner}/${repo}/contents/${path}`);
}
export async function createFile(token, owner, repo, path, content, message = 'Upload via GitDrive') {
  return request(token, 'PUT', `/repos/${owner}/${repo}/contents/${path}`, { message, content });
}
export async function updateFile(token, owner, repo, path, content, sha, message = 'Update via GitDrive') {
  return request(token, 'PUT', `/repos/${owner}/${repo}/contents/${path}`, { message, content, sha });
}
export async function deleteFile(token, owner, repo, path, sha, message = 'Delete via GitDrive') {
  return request(token, 'DELETE', `/repos/${owner}/${repo}/contents/${path}`, { message, sha });
}
export async function getFileContent(token, owner, repo, path) {
  return request(token, 'GET', `/repos/${owner}/${repo}/contents/${path}`);
}

// Folders (placeholder .gitkeep files)
export async function createFolder(token, owner, repo, folderPath) {
  const cleanPath = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
  const filePath = `${cleanPath}/.gitkeep`;
  try {
    const existing = await getFileContent(token, owner, repo, filePath);
    return existing;
  } catch {
    return createFile(token, owner, repo, filePath, btoa(''), `Create folder ${cleanPath}`);
  }
}

// Search
export async function searchCode(token, owner, repo, query) {
  return request(token, 'GET',
    `/search/code?q=${encodeURIComponent(query)}+repo:${owner}/${repo}`);
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
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(1)} MB`;
}
export function getMimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types = {
    png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',
    svg:'image/svg+xml',webp:'image/webp',pdf:'application/pdf',
    mp4:'video/mp4',mp3:'audio/mpeg',
  };
  return types[ext] || 'application/octet-stream';
}