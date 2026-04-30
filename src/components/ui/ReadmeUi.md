/**
 * GitDrive — UI Component Catalog (components/ui)
 * Navigate to /catalog-ui, then Ctrl/Cmd+P → Save as PDF
 */

const DATE = '2026-04-30';

const UI_FILES = [
  {
    path: 'components/ui/accordion.jsx',
    radix: '@radix-ui/react-accordion',
    exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
    description: 'Vertically stacked, collapsible content sections. AccordionTrigger auto-rotates its ChevronDown icon on open. AccordionContent uses height-based CSS animations (animate-accordion-up / down).',
    props: [
      { name: 'type', type: '"single" | "multiple"', desc: 'Whether one or many items can be open at once (on root Accordion).' },
      { name: 'collapsible', type: 'boolean', desc: 'Allow closing all items when type="single".' },
      { name: 'value / defaultValue', type: 'string', desc: 'Controlled / uncontrolled open item.' },
    ],
    code: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
  from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
))
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref}
      className={cn("flex flex-1 items-center justify-between py-4 text-sm font-medium",
        "transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className)} {...props}>
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up
               data-[state=open]:animate-accordion-down" {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))`,
    usage: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section title</AccordionTrigger>
    <AccordionContent>Section body content.</AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
  {
    path: 'components/ui/alert.jsx',
    radix: null,
    exports: ['Alert', 'AlertTitle', 'AlertDescription'],
    description: 'Inline alert banner with two variants. Accepts an optional lucide icon as a direct child — the icon is absolutely positioned to the left and content is auto-padded.',
    props: [
      { name: 'variant', type: '"default" | "destructive"', desc: 'Visual severity level.' },
    ],
    code: `const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px]"
  + " [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  { variants: { variant: {
      default: "bg-background text-foreground",
      destructive: "border-destructive/50 text-destructive [&>svg]:text-destructive",
  }}, defaultVariants: { variant: "default" }}
)
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
))
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
))
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
))`,
    usage: `<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>`,
  },
  {
    path: 'components/ui/avatar.jsx',
    radix: '@radix-ui/react-avatar',
    exports: ['Avatar', 'AvatarImage', 'AvatarFallback'],
    description: 'Circular user avatar with image and fallback text/icon. Radix automatically shows the fallback when the image fails to load.',
    props: [
      { name: 'src', type: 'string', desc: 'Image URL passed to AvatarImage.' },
      { name: 'alt', type: 'string', desc: 'Accessible alt text for the image.' },
      { name: 'className (Avatar)', type: 'string', desc: 'Override size — default is h-10 w-10.' },
    ],
    code: `const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props} />
))
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref}
    className={cn("aspect-square h-full w-full", className)} {...props} />
))
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props} />
))`,
    usage: `<Avatar>
  <AvatarImage src={user.avatar_url} alt={user.login} />
  <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
</Avatar>`,
  },
  {
    path: 'components/ui/badge.jsx',
    radix: null,
    exports: ['Badge', 'badgeVariants'],
    description: 'Small inline label used for tags, status chips, counts, etc. Uses cva for variants. Renders as a <div> by default.',
    props: [
      { name: 'variant', type: '"default" | "secondary" | "destructive" | "outline"', desc: 'Color scheme.' },
    ],
    code: `const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  { variants: { variant: {
      default:     "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
      secondary:   "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
      outline:     "text-foreground",
  }}, defaultVariants: { variant: "default" }}
)
function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}`,
    usage: `<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>`,
  },
  {
    path: 'components/ui/button.jsx',
    radix: '@radix-ui/react-slot',
    exports: ['Button', 'buttonVariants'],
    description: 'The primary interactive element. Built with cva for variant + size combinations. Supports asChild for polymorphic rendering (e.g. wrapping a link).',
    props: [
      { name: 'variant', type: '"default"|"destructive"|"outline"|"secondary"|"ghost"|"link"', desc: 'Visual style.' },
      { name: 'size', type: '"default"|"sm"|"lg"|"icon"', desc: 'Height and padding preset.' },
      { name: 'asChild', type: 'boolean', desc: 'Renders as the child element instead of <button>.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables pointer events and reduces opacity.' },
    ],
    code: `const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium"
  + " transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
  + " disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4",
  { variants: {
      variant: {
        default:     "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:     "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:   "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        link:        "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-md px-3 text-xs",
        lg:      "h-10 rounded-md px-8",
        icon:    "h-9 w-9",
      },
  }, defaultVariants: { variant: "default", size: "default" }}
)
const Button = React.forwardRef(({ className, variant, size, asChild=false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})`,
    usage: `<Button>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive"><Trash2 /> Delete</Button>
<Button size="icon"><Plus /></Button>
<Button asChild><a href="/somewhere">Link button</a></Button>`,
  },
  {
    path: 'components/ui/card.jsx',
    radix: null,
    exports: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
    description: 'Composable card container with header, content, and footer sub-components. All use forwardRef and accept className overrides.',
    props: [
      { name: 'className', type: 'string', desc: 'All sub-components accept className for customization.' },
    ],
    code: `const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
))
const CardHeader  = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
const CardTitle   = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
))
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
const CardFooter  = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))`,
    usage: `<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle text</CardDescription>
  </CardHeader>
  <CardContent>Main content goes here.</CardContent>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>`,
  },
  {
    path: 'components/ui/checkbox.jsx',
    radix: '@radix-ui/react-checkbox',
    exports: ['Checkbox'],
    description: 'Accessible checkbox input. Shows a Check icon from lucide-react when checked. Supports disabled state with opacity reduction.',
    props: [
      { name: 'checked', type: 'boolean | "indeterminate"', desc: 'Controlled checked state.' },
      { name: 'defaultChecked', type: 'boolean', desc: 'Uncontrolled initial state.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', desc: 'Change handler.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the checkbox.' },
    ],
    code: `const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className)} {...props}>
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))`,
    usage: `const [checked, setChecked] = useState(false)
<Checkbox checked={checked} onCheckedChange={setChecked} id="tos" />
<Label htmlFor="tos">Accept terms</Label>`,
  },
  {
    path: 'components/ui/dialog.jsx',
    radix: '@radix-ui/react-dialog',
    exports: ['Dialog', 'DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogFooter', 'DialogTitle', 'DialogDescription', 'DialogClose'],
    description: 'Accessible modal dialog with animated overlay. DialogContent renders into a Portal and includes a built-in close (×) button. Header and Footer are layout helpers only.',
    props: [
      { name: 'open', type: 'boolean', desc: 'Controlled open state on Dialog root.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', desc: 'Called when open state changes.' },
      { name: 'className (DialogContent)', type: 'string', desc: 'Override max-width, padding, etc.' },
    ],
    code: `const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal  = DialogPrimitive.Portal
const DialogClose   = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in"
      + " data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      + " data-[state=open]:fade-in-0", className)} {...props} />
))
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref}
      className={cn("fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg"
        + " -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg"
        + " duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out"
        + " data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70
        ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring">
        <X className="h-4 w-4" /><span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref}
    className={cn("text-sm text-muted-foreground", className)} {...props} />
))`,
    usage: `<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md rounded-2xl">
    <DialogHeader>
      <DialogTitle>Modal title</DialogTitle>
      <DialogDescription>Modal description.</DialogDescription>
    </DialogHeader>
    <p>Body content here.</p>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
  },
  {
    path: 'components/ui/dropdown-menu.jsx',
    radix: '@radix-ui/react-dropdown-menu',
    exports: ['DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuCheckboxItem', 'DropdownMenuRadioItem', 'DropdownMenuLabel', 'DropdownMenuSeparator', 'DropdownMenuShortcut', 'DropdownMenuGroup', 'DropdownMenuSub', 'DropdownMenuSubTrigger', 'DropdownMenuSubContent'],
    description: 'Context/action menu that opens below a trigger. Supports sub-menus, checkboxes, radio groups, labels, shortcuts, and separators.',
    props: [
      { name: 'open / onOpenChange', type: 'boolean / fn', desc: 'Controlled open state on root.' },
      { name: 'inset', type: 'boolean', desc: 'Adds pl-8 to item for icon alignment without an icon.' },
    ],
    code: `const DropdownMenu        = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup   = DropdownMenuPrimitive.Group

const DropdownMenuContent = React.forwardRef(({ className, sideOffset=4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset}
      className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1"
        + " text-popover-foreground shadow-md data-[state=open]:animate-in"
        + " data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        + " data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95"
        + " data-[state=open]:zoom-in-95", className)} {...props} />
  </DropdownMenuPrimitive.Portal>
))
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref}
    className={cn("relative flex cursor-default select-none items-center gap-2 rounded-sm"
      + " px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent"
      + " focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      + " [&>svg]:size-4", inset && "pl-8", className)} {...props} />
))
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
))
const DropdownMenuShortcut = ({ className, ...props }) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
)`,
    usage: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" variant="ghost"><MoreVertical /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDownload}>
      <Download /> Download
      <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleRename}><Edit2 /> Rename</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
      <Trash2 /> Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  },
  {
    path: 'components/ui/input.jsx',
    radix: null,
    exports: ['Input'],
    description: 'Styled HTML <input> with consistent height (h-9), ring focus style, and placeholder color. Supports all native input props including type, disabled, onChange.',
    props: [
      { name: 'type', type: 'string', desc: 'HTML input type (text, password, email, file, etc.).' },
      { name: 'placeholder', type: 'string', desc: 'Placeholder text.' },
      { name: 'disabled', type: 'boolean', desc: 'Reduces opacity and disables interaction.' },
      { name: 'className', type: 'string', desc: 'Extend or override base styles.' },
    ],
    code: `const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input type={type}
    className={cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base"
      + " shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm"
      + " file:font-medium placeholder:text-muted-foreground focus-visible:outline-none"
      + " focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
      + " disabled:opacity-50 md:text-sm",
      className)}
    ref={ref} {...props} />
))`,
    usage: `<Input type="text" placeholder="Enter your name" />
<Input type="password" placeholder="Password" className="font-mono" />
<Input type="file" onChange={handleFileChange} />`,
  },
  {
    path: 'components/ui/label.jsx',
    radix: '@radix-ui/react-label',
    exports: ['Label'],
    description: 'Accessible <label> element. Styled with peer-disabled CSS to dim automatically when its associated input is disabled.',
    props: [
      { name: 'htmlFor', type: 'string', desc: 'Associates the label with an input by id.' },
    ],
    code: `const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))`,
    usage: `<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`,
  },
  {
    path: 'components/ui/popover.jsx',
    radix: '@radix-ui/react-popover',
    exports: ['Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverAnchor'],
    description: 'Floating content panel anchored to a trigger. Unlike a dropdown, it renders arbitrary content (forms, date pickers, etc.). Animated in/out with data-state attributes.',
    props: [
      { name: 'align', type: '"start" | "center" | "end"', desc: 'Alignment relative to trigger (default: center).' },
      { name: 'sideOffset', type: 'number', desc: 'Gap in px between trigger and popover (default: 4).' },
    ],
    code: `const Popover        = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor  = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef(({ className, align="center", sideOffset=4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset}
      className={cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
        + " outline-none data-[state=open]:animate-in data-[state=closed]:animate-out"
        + " data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        + " data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className)} {...props} />
  </PopoverPrimitive.Portal>
))`,
    usage: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Pick a date</Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>`,
  },
  {
    path: 'components/ui/progress.jsx',
    radix: '@radix-ui/react-progress',
    exports: ['Progress'],
    description: 'Horizontal progress bar. The indicator width is controlled via a CSS translateX trick so the transition is smooth without changing element width.',
    props: [
      { name: 'value', type: 'number (0–100)', desc: 'Current progress percentage.' },
    ],
    code: `const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
    {...props}>
    <ProgressPrimitive.Indicator className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }} />
  </ProgressPrimitive.Root>
))`,
    usage: `const [progress, setProgress] = useState(40)
<Progress value={progress} className="h-3" />`,
  },
  {
    path: 'components/ui/scroll-area.jsx',
    radix: '@radix-ui/react-scroll-area',
    exports: ['ScrollArea', 'ScrollBar'],
    description: 'Custom-styled scrollable container. Hides the native scrollbar and replaces it with a Radix-managed one that shows on hover.',
    props: [
      { name: 'orientation', type: '"vertical" | "horizontal"', desc: 'Scrollbar direction on ScrollBar (default: vertical).' },
    ],
    code: `const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref}
    className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
const ScrollBar = React.forwardRef(({ className, orientation="vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar ref={ref} orientation={orientation}
    className={cn("flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className)} {...props}>
    <ScrollAreaPrimitive.ScrollAreaThumb
      className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))`,
    usage: `<ScrollArea className="h-48 w-full rounded-md border p-4">
  {longContent}
</ScrollArea>`,
  },
  {
    path: 'components/ui/select.jsx',
    radix: '@radix-ui/react-select',
    exports: ['Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem', 'SelectLabel', 'SelectGroup', 'SelectSeparator'],
    description: 'Accessible native-like select dropdown. SelectContent renders into a Portal. Selected item shows a checkmark. Includes scroll buttons for long lists.',
    props: [
      { name: 'value / onValueChange', type: 'string / fn', desc: 'Controlled value and change handler on Select root.' },
      { name: 'defaultValue', type: 'string', desc: 'Uncontrolled initial value.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the trigger.' },
      { name: 'placeholder (SelectValue)', type: 'string', desc: 'Shown when no value is selected.' },
    ],
    code: `const Select        = SelectPrimitive.Root
const SelectGroup   = SelectPrimitive.Group
const SelectValue   = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref}
    className={cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md"
      + " border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
      + " focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50", className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref}
    className={cn("relative flex w-full cursor-default select-none items-center rounded-sm"
      + " py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
      + " data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}>
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator><Check className="h-4 w-4" /></SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))`,
    usage: `<Select value={status} onValueChange={setStatus}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    path: 'components/ui/separator.jsx',
    radix: '@radix-ui/react-separator',
    exports: ['Separator'],
    description: 'Visual and semantic divider line. Supports horizontal (default) and vertical orientations. Marked decorative by default so screen readers ignore it.',
    props: [
      { name: 'orientation', type: '"horizontal" | "vertical"', desc: 'Line direction.' },
      { name: 'decorative', type: 'boolean', desc: 'When true the separator is hidden from accessibility tree (default: true).' },
    ],
    code: `const Separator = React.forwardRef((
  { className, orientation="horizontal", decorative=true, ...props }, ref
) => (
  <SeparatorPrimitive.Root ref={ref} decorative={decorative} orientation={orientation}
    className={cn("shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className)} {...props} />
))`,
    usage: `{/* Horizontal */}
<Separator className="my-4" />

{/* Vertical between items */}
<div className="flex items-center gap-2">
  <span>Item A</span>
  <Separator orientation="vertical" className="h-4" />
  <span>Item B</span>
</div>`,
  },
  {
    path: 'components/ui/sheet.jsx',
    radix: '@radix-ui/react-dialog',
    exports: ['Sheet', 'SheetTrigger', 'SheetContent', 'SheetHeader', 'SheetFooter', 'SheetTitle', 'SheetDescription', 'SheetClose'],
    description: 'Slide-in panel built on the Dialog primitive. Supports four sides (top, bottom, left, right — default right). Used for mobile drawers, settings panels, etc.',
    props: [
      { name: 'side', type: '"top"|"bottom"|"left"|"right"', desc: 'Which edge to slide in from (default: right).' },
    ],
    code: `const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out"
  + " data-[state=closed]:duration-300 data-[state=open]:duration-500"
  + " data-[state=open]:animate-in data-[state=closed]:animate-out",
  { variants: { side: {
      top:    "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      left:   "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
      right:  "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
  }}, defaultVariants: { side: "right" }}
)
const SheetContent = React.forwardRef(({ side="right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70
        hover:opacity-100 focus:ring-2 focus:ring-ring">
        <X className="h-4 w-4" />
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))`,
    usage: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Settings</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Make changes to your profile here.</SheetDescription>
    </SheetHeader>
    <div className="py-4">Content…</div>
  </SheetContent>
</Sheet>`,
  },
  {
    path: 'components/ui/skeleton.jsx',
    radix: null,
    exports: ['Skeleton'],
    description: 'Animated loading placeholder. Uses animate-pulse with bg-primary/10. Shape it with width/height classes to match the content being loaded.',
    props: [
      { name: 'className', type: 'string', desc: 'Set dimensions: e.g. className="h-4 w-32 rounded"' },
    ],
    code: `function Skeleton({ className, ...props }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />
  );
}`,
    usage: `{/* Replaces a card while data loads */}
<div className="space-y-2">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-10 w-full rounded-xl" />
</div>`,
  },
  {
    path: 'components/ui/switch.jsx',
    radix: '@radix-ui/react-switch',
    exports: ['Switch'],
    description: 'Toggle switch (on/off). The thumb slides 4px right when checked via translate-x-4. Background changes between bg-primary (checked) and bg-input (unchecked).',
    props: [
      { name: 'checked', type: 'boolean', desc: 'Controlled on/off state.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', desc: 'Change handler.' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the switch.' },
    ],
    code: `const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full"
      + " border-2 border-transparent shadow-sm transition-colors"
      + " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      + " focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      + " disabled:cursor-not-allowed disabled:opacity-50"
      + " data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className)} {...props}>
    <SwitchPrimitives.Thumb className={cn(
      "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0"
      + " transition-transform data-[state=checked]:translate-x-4"
      + " data-[state=unchecked]:translate-x-0"
    )} />
  </SwitchPrimitives.Root>
))`,
    usage: `const [enabled, setEnabled] = useState(false)
<div className="flex items-center gap-2">
  <Switch checked={enabled} onCheckedChange={setEnabled} id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>`,
  },
  {
    path: 'components/ui/table.jsx',
    radix: null,
    exports: ['Table', 'TableHeader', 'TableBody', 'TableFooter', 'TableRow', 'TableHead', 'TableCell', 'TableCaption'],
    description: 'Full-width semantic HTML table with styled rows. TableRow includes hover and selected states. Wraps in overflow-auto so wide tables scroll.',
    props: [],
    code: `const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref}
    className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className)} {...props} />
))
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th ref={ref}
    className={cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground", className)}
    {...props} />
))
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-2 align-middle", className)} {...props} />
))`,
    usage: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Size</TableHead>
      <TableHead>Modified</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {files.map(f => (
      <TableRow key={f.sha}>
        <TableCell>{f.name}</TableCell>
        <TableCell>{formatBytes(f.size)}</TableCell>
        <TableCell>{f.updated_at}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
  },
  {
    path: 'components/ui/tabs.jsx',
    radix: '@radix-ui/react-tabs',
    exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
    description: 'Tabbed interface. TabsList is a pill-style container. TabsTrigger gets a white background + shadow when active (data-[state=active]). TabsContent is shown/hidden by Radix.',
    props: [
      { name: 'defaultValue', type: 'string', desc: 'Initially selected tab value.' },
      { name: 'value / onValueChange', type: 'string / fn', desc: 'Controlled tab state.' },
    ],
    code: `const Tabs        = TabsPrimitive.Root
const TabsList    = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref}
    className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className)} {...props} />
))
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref}
    className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1"
      + " text-sm font-medium ring-offset-background transition-all"
      + " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      + " disabled:pointer-events-none disabled:opacity-50"
      + " data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className)} {...props} />
))
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref}
    className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2",
      className)} {...props} />
))`,
    usage: `<Tabs defaultValue="files">
  <TabsList>
    <TabsTrigger value="files">Files</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="files">Files content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>`,
  },
  {
    path: 'components/ui/textarea.jsx',
    radix: null,
    exports: ['Textarea'],
    description: 'Styled <textarea> with consistent border, focus ring, and placeholder color — matching the Input component. Min-height is 60px.',
    props: [
      { name: 'rows', type: 'number', desc: 'Number of visible text rows (native HTML attribute).' },
      { name: 'disabled', type: 'boolean', desc: 'Disables the textarea.' },
      { name: 'placeholder', type: 'string', desc: 'Placeholder text.' },
    ],
    code: `const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea className={cn(
    "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2"
    + " text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
    + " focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
    + " disabled:opacity-50 md:text-sm",
    className)} ref={ref} {...props} />
))`,
    usage: `<Textarea
  placeholder="Write a description…"
  rows={4}
  value={description}
  onChange={e => setDescription(e.target.value)}
/>`,
  },
  {
    path: 'components/ui/toast.jsx',
    radix: '@radix-ui/react-toast (custom)',
    exports: ['Toast', 'ToastTitle', 'ToastDescription', 'ToastAction', 'ToastClose', 'ToastProvider', 'ToastViewport'],
    description: 'Toast notification primitives. Used with the useToast hook and the Toaster component (components/ui/toaster). For simpler usage the project also uses Sonner (from sonner package) via the Sonner provider in App.jsx.',
    props: [
      { name: 'variant', type: '"default" | "destructive"', desc: 'Toast color scheme.' },
    ],
    code: `const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between"
  + " space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all"
  + " data-[state=open]:animate-in data-[state=closed]:animate-out"
  + " data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full",
  { variants: { variant: {
      default:     "border bg-background text-foreground",
      destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
  }}, defaultVariants: { variant: "default" }}
)
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
))
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))`,
    usage: `// Preferred: use Sonner (already set up in App.jsx)
import { toast } from 'sonner';
toast.success('File uploaded!');
toast.error('Upload failed.');

// Or use the hook-based toast:
const { toast } = useToast()
toast({ title: "Saved", description: "Your changes were saved." })`,
  },
  {
    path: 'components/ui/tooltip.jsx',
    radix: '@radix-ui/react-tooltip',
    exports: ['Tooltip', 'TooltipTrigger', 'TooltipContent', 'TooltipProvider'],
    description: 'Hover/focus tooltip. Must be wrapped in TooltipProvider (usually placed once in App.jsx or the layout). Renders into a Portal.',
    props: [
      { name: 'sideOffset', type: 'number', desc: 'Gap in px between trigger and tooltip (default: 4).' },
      { name: 'delayDuration (Provider)', type: 'number', desc: 'Delay before showing in ms (default: 700).' },
    ],
    code: `const TooltipProvider = TooltipPrimitive.Provider
const Tooltip         = TooltipPrimitive.Root
const TooltipTrigger  = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({ className, sideOffset=4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset}
      className={cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs"
        + " text-primary-foreground animate-in fade-in-0 zoom-in-95"
        + " data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        + " data-[state=closed]:zoom-out-95", className)} {...props} />
  </TooltipPrimitive.Portal>
))`,
    usage: `// Wrap your app once:
<TooltipProvider>
  <App />
</TooltipProvider>

// Then use anywhere:
<Tooltip>
  <TooltipTrigger asChild>
    <Button size="icon" variant="ghost"><LogOut /></Button>
  </TooltipTrigger>
  <TooltipContent>Sign out</TooltipContent>
</Tooltip>`,
  },
];

// ─── Render ───────────────────────────────────────────────────────────────────

export default function CatalogUI() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; }

        .cat { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b;
               max-width: 920px; margin: 0 auto; padding: 48px 48px 0; }

        /* Cover */
        .cover { min-height: 100vh; display: flex; flex-direction: column;
                 justify-content: center; border-bottom: 3px solid #6366f1;
                 page-break-after: always; padding-bottom: 80px; }
        .cover-badge { display: inline-block; background: #eef2ff; color: #4338ca;
                       font-size: 11px; font-weight: 700; letter-spacing: .08em;
                       text-transform: uppercase; padding: 4px 14px;
                       border-radius: 100px; margin-bottom: 24px; }
        .cover h1 { font-size: 58px; font-weight: 800; letter-spacing: -2px;
                    color: #0f172a; line-height: 1; margin-bottom: 12px; }
        .cover h1 span { color: #6366f1; }
        .cover .sub { font-size: 18px; color: #64748b; max-width: 500px;
                      line-height: 1.6; margin-bottom: 48px; }
        .cover-rule { height: 2px; background: #e2e8f0; margin: 40px 0; }
        .cover-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .cover-meta label { display: block; font-size: 10px; font-weight: 700;
                            letter-spacing: .1em; text-transform: uppercase;
                            color: #94a3b8; margin-bottom: 4px; }
        .cover-meta span { font-size: 15px; font-weight: 600; color: #1e293b; }

        /* TOC */
        .toc { page-break-after: always; padding-bottom: 80px; }
        .section-label { font-size: 11px; font-weight: 700; letter-spacing: .12em;
                         text-transform: uppercase; color: #6366f1; margin-bottom: 24px;
                         padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
        .toc-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 9px; }
        .toc-num { font-size: 11px; font-weight: 700; color: #6366f1; width: 28px; flex-shrink: 0; }
        .toc-name { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #1e293b; }
        .toc-dots { flex: 1; border-bottom: 1px dotted #cbd5e1; margin: 0 8px 4px; }
        .toc-exports { font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; }

        /* Component chapter */
        .chapter { page-break-before: always; padding-bottom: 72px; }
        .ch-header { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
        .ch-top { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 10px; }
        .ch-num { font-size: 11px; font-weight: 700; color: #6366f1; letter-spacing: .08em;
                  padding-top: 2px; white-space: nowrap; }
        .ch-path { font-family: 'JetBrains Mono', monospace; font-size: 17px;
                   font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .ch-radix { font-size: 11px; color: #6366f1; font-family: 'JetBrains Mono', monospace;
                    background: #eef2ff; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;
                    display: inline-block; }
        .ch-desc { font-size: 13.5px; color: #475569; line-height: 1.7; max-width: 700px; }

        /* Exports row */
        .exports-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0; }
        .exp-chip { font-family: 'JetBrains Mono', monospace; font-size: 11px;
                    background: #f1f5f9; color: #334155; padding: 2px 8px;
                    border-radius: 4px; border: 1px solid #e2e8f0; }

        /* Props table */
        .props-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12.5px; }
        .props-table th { text-align: left; font-size: 10px; font-weight: 700; letter-spacing: .08em;
                          text-transform: uppercase; color: #94a3b8; padding: 6px 10px;
                          background: #f8fafc; border-bottom: 2px solid #e2e8f0; }
        .props-table td { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        .props-table td:first-child { font-family: 'JetBrains Mono', monospace; color: #6366f1; font-size: 12px; }
        .props-table td:nth-child(2) { font-family: 'JetBrains Mono', monospace; color: #64748b; font-size: 11px; }
        .props-table td:last-child { color: #475569; }

        /* Code blocks */
        .block-label { font-size: 10px; font-weight: 700; letter-spacing: .1em;
                       text-transform: uppercase; color: #94a3b8; margin-bottom: 6px; }
        .code-wrap { background: #0f172a; border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
        .code-bar { display: flex; align-items: center; gap: 5px; padding: 8px 14px;
                    background: #1e293b; border-bottom: 1px solid #334155; }
        .dot { width: 9px; height: 9px; border-radius: 50%; }
        .dr { background: #ef4444; } .dy { background: #f59e0b; } .dg { background: #22c55e; }
        .code-fn { margin-left: 8px; font-family: 'JetBrains Mono', monospace;
                   font-size: 10px; color: #94a3b8; }
        pre { font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.75;
              color: #e2e8f0; padding: 18px; overflow-x: auto; white-space: pre-wrap;
              word-break: break-word; }
        .usage-wrap { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
                      overflow: hidden; }
        .usage-bar { padding: 6px 14px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0;
                     font-size: 10px; font-weight: 700; letter-spacing: .08em;
                     text-transform: uppercase; color: #94a3b8; }
        .usage-wrap pre { background: transparent; color: #334155; font-size: 11.5px; padding: 14px 18px; }

        /* Print button */
        .print-btn { position: fixed; bottom: 32px; right: 32px; background: #6366f1;
                     color: #fff; border: none; padding: 14px 28px; font-size: 14px;
                     font-weight: 600; font-family: 'Inter', sans-serif; border-radius: 100px;
                     cursor: pointer; box-shadow: 0 8px 32px rgba(99,102,241,.35);
                     z-index: 1000; transition: background .15s; }
        .print-btn:hover { background: #4f46e5; }

        @media print {
          .print-btn { display: none !important; }
          .cat { padding: 0; max-width: 100%; }
          .cover { padding: 48px; min-height: auto; }
          .chapter, .toc { padding: 48px 48px 0; }
          pre { font-size: 9.5px; }
        }
      `}</style>

      <button className="print-btn" onClick={() => window.print()}>🖨️ Print / Save as PDF</button>

      <div className="cat">

        {/* ── Cover ── */}
        <div className="cover">
          <div className="cover-badge">UI Component Reference</div>
          <h1>Git<span>Drive</span> UI</h1>
          <p className="sub">Complete source reference for every component in <code style={{fontFamily:'JetBrains Mono,monospace',fontSize:16}}>components/ui/</code> — built on shadcn/ui + Radix UI primitives.</p>
          <div className="cover-rule" />
          <div className="cover-meta">
            <div><label>Date</label><span>{DATE}</span></div>
            <div><label>Components</label><span>{UI_FILES.length} files</span></div>
            <div><label>Base Library</label><span>shadcn/ui</span></div>
            <div><label>Primitives</label><span>Radix UI</span></div>
            <div><label>Styling</label><span>Tailwind CSS + cva</span></div>
            <div><label>Icons</label><span>lucide-react</span></div>
          </div>
        </div>

        {/* ── TOC ── */}
        <div className="toc">
          <p className="section-label">Table of Contents</p>
          {UI_FILES.map((f, i) => (
            <div key={i} className="toc-row">
              <span className="toc-num">{String(i+1).padStart(2,'0')}</span>
              <span className="toc-name">{f.path.replace('components/ui/','')}</span>
              <span className="toc-dots" />
              <span className="toc-exports">{f.exports.slice(0,3).join(', ')}{f.exports.length > 3 ? '…' : ''}</span>
            </div>
          ))}
        </div>

        {/* ── Chapters ── */}
        {UI_FILES.map((f, i) => (
          <div key={i} className="chapter">
            <div className="ch-header">
              <div className="ch-top">
                <span className="ch-num">§{String(i+1).padStart(2,'0')}</span>
                <div style={{flex:1}}>
                  <div className="ch-path">{f.path}</div>
                  {f.radix && <div className="ch-radix">Radix: {f.radix}</div>}
                  <div className="ch-desc">{f.description}</div>
                </div>
              </div>
              <div className="exports-row">
                {f.exports.map((e,j) => <span key={j} className="exp-chip">{e}</span>)}
              </div>
            </div>

            {f.props.length > 0 && (
              <>
                <div className="block-label">Props</div>
                <table className="props-table">
                  <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
                  <tbody>
                    {f.props.map((p,j) => (
                      <tr key={j}>
                        <td>{p.name}</td>
                        <td>{p.type}</td>
                        <td>{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <div className="block-label">Source</div>
            <div className="code-wrap">
              <div className="code-bar">
                <div className="dot dr"/><div className="dot dy"/><div className="dot dg"/>
                <span className="code-fn">{f.path}</span>
              </div>
              <pre>{f.code}</pre>
            </div>

            <div className="block-label">Usage Example</div>
            <div className="usage-wrap">
              <div className="usage-bar">Example</div>
              <pre>{f.usage}</pre>
            </div>
          </div>
        ))}

      </div>
    </>
  );
}