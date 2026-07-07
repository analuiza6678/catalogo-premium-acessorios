import { SelectHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={twMerge(
        "min-h-12 w-full rounded-2xl border border-rosa-bebe bg-white px-4 text-sm text-preto outline-none transition focus:border-dourado focus:ring-4 focus:ring-dourado/10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
