import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
}