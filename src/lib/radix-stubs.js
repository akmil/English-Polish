// Minimal Radix UI primitive stubs for demo
export const AccordionPrimitive = {
  Root: ({ children, ...props }) => <div {...props}>{children}</div>,
  Item: ({ children, ...props }) => <div {...props}>{children}</div>,
  Header: ({ children, ...props }) => <div {...props}>{children}</div>,
  Trigger: ({ children, ...props }) => <button {...props}>{children}</button>,
  Content: ({ children, ...props }) => <div {...props}>{children}</div>,
};
export const CheckboxPrimitive = {
  Root: ({ children, ...props }) => <label {...props}>{children}</label>,
  Indicator: ({ children, ...props }) => <span {...props}>{children}</span>,
};
// Add more primitives as needed for other components
