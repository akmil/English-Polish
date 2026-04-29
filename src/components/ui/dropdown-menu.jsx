// Minimal DropdownMenu components for UI
export function DropdownMenu({ children }) {
  return <div>{children}</div>;
}
export function DropdownMenuTrigger({ children, asChild }) {
  return <span>{children}</span>;
}
export function DropdownMenuContent({ children, align, className }) {
  return <div className={className}>{children}</div>;
}
export function DropdownMenuItem({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function DropdownMenuSeparator() {
  return <hr />;
}
export default DropdownMenu;