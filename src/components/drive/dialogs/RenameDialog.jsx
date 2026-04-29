import { useState, useEffect } from 'react';
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
}