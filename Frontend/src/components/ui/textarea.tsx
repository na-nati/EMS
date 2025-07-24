import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "filled" | "outline";
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant = "default",
    resize = "vertical",
    rows = 3,
    onChange,
    ...props
  }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // Auto-resize functionality
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const resizeTextarea = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textarea.addEventListener("input", resizeTextarea);
      resizeTextarea(); // Initial resize

      return () => textarea.removeEventListener("input", resizeTextarea);
    }, []);

    // Handle external value changes
    React.useEffect(() => {
      if (textareaRef.current && props.value !== undefined) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [props.value]);

    const variants = {
      default: "border-input bg-background",
      filled: "bg-accent border-transparent",
      outline: "border-border bg-transparent border-2",
    };

    const resizeOptions = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <textarea
        ref={textareaRef}
        rows={rows}
        className={cn(
          "flex w-full rounded-lg border px-4 py-3 text-sm transition-all",
          "placeholder:text-muted-foreground focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20",
          variants[variant],
          resizeOptions[resize],
          className
        )}
        onChange={(e) => {
          onChange?.(e);
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };