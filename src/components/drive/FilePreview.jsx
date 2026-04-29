import { useEffect, useState } from 'react';
import { X, Download, Loader2, FileText, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFileContent, base64ToBlob, getMimeType, formatBytes } from '@/lib/github';
import { useGitHub } from '@/context/GitHubContext';
import JSZip from 'jszip';

function getPreviewType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if ([
    'png','jpg','jpeg','gif','svg','webp','bmp','ico'
  ].includes(ext)) return 'image';
  if ([
    'mp4','webm','ogg','mov','avi','mkv'
  ].includes(ext)) return 'video';
  if ([
    'mp3','wav','flac','ogg','aac','m4a'
  ].includes(ext)) return 'audio';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['ppt','pptx','key'].includes(ext)) return 'presentation';
  if (['zip','jar','apk','ipa'].includes(ext)) return 'zip';
  if ([
    'txt','md','csv','json','yaml','yml','toml','xml','html','css',
    'js','jsx','ts','tsx','py','rb','go','rs','java','c','cpp',
    'h','cs','php','sh','bash','env','gitignore','log'
  ].includes(ext)) return 'text';
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
        setTextContent(atob(data.content.replace(/\n/g, '')));
      } else if (['audio','video'].includes(previewType)) {
        const res = await fetch(data.download_url);
        setBlobUrl(URL.createObjectURL(await res.blob()));
      } else if (['image','pdf'].includes(previewType)) {
        const blob = base64ToBlob(data.content.replace(/\n/g, ''), mimeType);
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
}