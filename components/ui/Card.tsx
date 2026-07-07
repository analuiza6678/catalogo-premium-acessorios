import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge("rounded-[24px] border border-rosa-bebe/70 bg-white shadow-soft", className)} {...props} />;
}
