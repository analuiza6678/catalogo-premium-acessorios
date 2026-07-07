"use client";

import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-preto/30 p-4 backdrop-blur-sm sm:items-center">
      <div className="animate-pop w-full max-w-xl rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-preto">{title}</h2>
          <Button type="button" variant="ghost" className="h-10 w-10 px-0" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
