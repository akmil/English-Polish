import React from "react";
// Stub for LabelPrimitive
const LabelPrimitive = {
	Root: React.forwardRef((props, ref) => <label ref={ref} {...props} />),
};
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => (
	<LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));

export { Label };
