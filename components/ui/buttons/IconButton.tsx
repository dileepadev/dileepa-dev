import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./Button";

export function IconButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      size="icon"
      className={cn(
        "rounded-full bg-accent-blue/10 text-gray-300 hover:bg-accent-blue hover:text-on-accent hover:scale-105 hover:shadow-xl transition-all duration-500 ease-in-out focus-visible:ring-2 focus-visible:ring-accent-blue",
        className,
      )}
      {...props}
    />
  );
}
