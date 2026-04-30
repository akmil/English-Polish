import React from "react";
// Stubs for Sheet primitives
const SheetPortal = ({ children }) => <>{children}</>;
const SheetOverlay = () => <div />;
const SheetPrimitive = {
	Content: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
	Close: ({ children, ...props }) => <button {...props}>{children}</button>,
};
import { X } from "@/lib/lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sheetVariants = cva(
	"fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out" +
		" data-[state=closed]:duration-300 data-[state=open]:duration-500" +
		" data-[state=open]:animate-in data-[state=closed]:animate-out",
	{
		variants: {
			side: {
				top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
				bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
				left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
				right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
			},
		},
		defaultVariants: { side: "right" },
	}
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
	<SheetPortal>
		<SheetOverlay />
		<SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
			<SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:ring-2 focus:ring-ring">
				<X className="h-4 w-4" />
			</SheetPrimitive.Close>
			{children}
		</SheetPrimitive.Content>
	</SheetPortal>
));

export { SheetContent };
