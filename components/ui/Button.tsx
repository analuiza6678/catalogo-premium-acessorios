import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-dourado text-white shadow-gold hover:bg-dourado-claro",
  secondary: "bg-rosa-bebe text-preto hover:bg-rosa-claro",
  ghost: "bg-white text-texto ring-1 ring-rosa-bebe hover:text-preto hover:ring-dourado",
  danger: "bg-red-50 text-red-700 hover:bg-red-100"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          className
        )
      )}
      {...props}
    />
  );
}
