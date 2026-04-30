import React from "react";
// Stub for SelectPrimitive
const SelectPrimitive = {
	Root: ({ children, ...props }) => <div {...props}>{children}</div>,
	Group: ({ children, ...props }) => <div {...props}>{children}</div>,
	Value: ({ children, ...props }) => <span {...props}>{children}</span>,
	Trigger: React.forwardRef((props, ref) => <button ref={ref} {...props} />),
	Icon: { asChild: ({ children }) => children },
	Item: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
	ItemIndicator: ({ children, ...props }) => <span {...props}>{children}</span>,
	ItemText: ({ children, ...props }) => <span {...props}>{children}</span>,
};
import { ChevronDown, Check } from "@/lib/lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md",
			"border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
			"focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50",
			className
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-4 w-4 opacity-50" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center rounded-sm",
			"py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));

export { Select, SelectTrigger, SelectValue, SelectGroup, SelectItem };
