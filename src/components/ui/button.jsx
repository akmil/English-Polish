// @ts-nocheck
// Minimal Button component for UI
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
export default Button;