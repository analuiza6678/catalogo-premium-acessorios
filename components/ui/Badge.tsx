import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full bg-rosa-bebe px-3 py-1 text-xs font-semibold text-preto",
        className
      )}
      {...props}
    />
  );
}
