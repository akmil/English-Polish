// Minimal Dialog components for UI
export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return <div>{children}</div>;
}
export function DialogContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
export function DialogHeader({ children }) {
  return <div>{children}</div>;
}
export function DialogTitle({ children, className }) {
  return <h2 className={className}>{children}</h2>;
}
export function DialogFooter({ children, className }) {
  return <div className={className}>{children}</div>;
}
export default Dialog;