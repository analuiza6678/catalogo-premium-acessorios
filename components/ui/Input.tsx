import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        "min-h-12 w-full rounded-2xl border border-rosa-bebe bg-white px-4 text-sm text-preto outline-none transition placeholder:text-texto/45 focus:border-dourado focus:ring-4 focus:ring-dourado/10",
        className
      )}
      {...props}
    />
  );
}
