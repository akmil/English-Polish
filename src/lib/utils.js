// cn utility for className composition
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}