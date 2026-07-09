import { TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={twMerge(
        "min-h-28 w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 text-sm text-preto outline-none transition placeholder:text-texto/45 focus:border-dourado focus:ring-4 focus:ring-dourado/10 aria-[invalid=true]:border-red-300 aria-[invalid=true]:focus:ring-red-100",
        className
      )}
      {...props}
    />
  );
}
