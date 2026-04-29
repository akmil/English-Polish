export default function NewRepoDialog({ open, onClose, onCreated }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl p-8 shadow-xl flex flex-col items-center">
        <p className="mb-4 text-slate-700">NewRepoDialog component not yet implemented.</p>
        <button
          className="px-4 py-2 rounded bg-indigo-500 text-white mb-2"
          onClick={() => onCreated && onCreated({ name: 'new-demo-repo' })}
        >
          Create Example Repo
        </button>
        <button
          className="px-3 py-1 rounded bg-slate-200 text-slate-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}