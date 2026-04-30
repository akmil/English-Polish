import React from "react";
// Stub for TooltipPrimitive
const TooltipPrimitive = {
	Provider: ({ children }) => <>{children}</>,
	Root: ({ children, ...props }) => <div {...props}>{children}</div>,
	Trigger: ({ children, ...props }) => <button {...props}>{children}</button>,
	Portal: ({ children }) => <>{children}</>,
	Content: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
};
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Portal>
		<TooltipPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				"z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs",
				"text-primary-foreground animate-in fade-in-0 zoom-in-95",
				"data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
				"data-[state=closed]:zoom-out-95",
				className
			)}
			{...props}
		/>
	</TooltipPrimitive.Portal>
));

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
