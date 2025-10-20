import { cn } from "@/lib/utils";
import * as React from "react";

const DraculaCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-purple-500/20 bg-card/50 backdrop-blur-sm text-card-foreground shadow-lg shadow-purple-500/10",
      className,
    )}
    {...props}
  />
));
DraculaCard.displayName = "DraculaCard";

const DraculaCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
DraculaCardHeader.displayName = "DraculaCardHeader";

const DraculaCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-purple-400 dark:text-purple-300",
      className,
    )}
    {...props}
  />
));
DraculaCardTitle.displayName = "DraculaCardTitle";

const DraculaCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DraculaCardDescription.displayName = "DraculaCardDescription";

const DraculaCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
DraculaCardContent.displayName = "DraculaCardContent";

const DraculaCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
DraculaCardFooter.displayName = "DraculaCardFooter";

export {
  DraculaCard, DraculaCardContent, DraculaCardDescription, DraculaCardFooter, DraculaCardHeader, DraculaCardTitle
};

