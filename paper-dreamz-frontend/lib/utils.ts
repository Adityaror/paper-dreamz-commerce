import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Section anchors like "#collections" live on the home page; from any other page they must point back to "/".
export function pageHref(href: string, pathname: string | null) {
  return href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
}
