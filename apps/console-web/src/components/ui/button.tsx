import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-50", { variants: { variant: { default: "bg-orange-500 text-white hover:bg-orange-400", outline: "border border-slate-700" } }, defaultVariants: { variant: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, ...props }, ref) => <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />);
Button.displayName = "Button";
