import React from "react";
// Stub for PopoverPrimitive
const PopoverPrimitive = {
	Root: ({ children, ...props }) => <div {...props}>{children}</div>,
	Trigger: ({ children, ...props }) => <button {...props}>{children}</button>,
	Anchor: ({ children, ...props }) => <span {...props}>{children}</span>,
	Portal: ({ children }) => <>{children}</>,
	Content: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
};
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Content
			ref={ref}
			align={align}
			sideOffset={sideOffset}
			className={cn(
				"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
				"outline-none data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				className
			)}
			{...props}
		/>
	</PopoverPrimitive.Portal>
));

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
