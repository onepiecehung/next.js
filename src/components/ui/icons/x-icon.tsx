import { createLucideIcon } from "lucide-react";
import "./x-icon.css";

/**
 * Custom X (Twitter) Icon Component
 * Created using lucide-react's createLucideIcon function
 * Provides a consistent X icon that matches the official branding
 * Supports all standard lucide-react props including className
 */
const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      stroke: "none",
      fill: "currentColor",
      className: "x-icon",
      key: "x-icon",
    },
  ],
]);

export { XIcon };
