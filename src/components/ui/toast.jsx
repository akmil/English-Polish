import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center justify-between" +
		" space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all" +
		" data-[state=open]:animate-in data-[state=closed]:animate-out" +
		" data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full",
	{
		variants: {
			variant: {
				default: "border bg-background text-foreground",
				destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
			},
		},
		defaultVariants: { variant: "default" },
	}
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => (
	<div ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
));
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));

export { Toast, ToastTitle, ToastDescription };
