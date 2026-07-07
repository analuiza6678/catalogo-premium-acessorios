"use client";

import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

type ImageUploadProps = {
  label: string;
  currentUrl?: string | null;
  helpText?: string;
  aspectClassName?: string;
  multiple?: boolean;
  files?: File[];
  onFilesChange: (files: File[]) => void;
  onRemove?: () => void;
};

export function ImageUpload({ label, currentUrl, helpText, aspectClassName = "aspect-[4/3]", multiple, files = [], onFilesChange, onRemove }: ImageUploadProps) {
  const previewUrl = useMemo(() => (files[0] ? URL.createObjectURL(files[0]) : null), [files]);
  const imageUrl = previewUrl || currentUrl;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="rounded-[24px] border border-dashed border-dourado/50 bg-bege p-4 transition hover:border-dourado">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-preto">
          <ImagePlus size={18} className="text-dourado" />
          {label}
        </span>
        {imageUrl && onRemove ? (
          <Button type="button" variant="ghost" onClick={onRemove} className="min-h-0 rounded-full px-3 py-1.5 text-xs text-red-700 ring-red-100 hover:ring-red-200">
            <Trash2 size={14} />
            Remover
          </Button>
        ) : null}
      </div>

      {imageUrl ? (
        <div className={`relative mb-3 overflow-hidden rounded-2xl bg-white ${aspectClassName}`}>
          <Image src={imageUrl} alt={label} fill className="object-cover" />
        </div>
      ) : (
        <div className={`mb-3 grid place-items-center rounded-2xl border border-dourado/15 bg-white/70 text-xs text-texto/55 ${aspectClassName}`}>
          Nenhuma imagem cadastrada
        </div>
      )}

      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={(event) => onFilesChange(Array.from(event.target.files ?? []))}
        className="cursor-pointer rounded-xl bg-white file:mr-3 file:rounded-full file:border-0 file:bg-rosa-bebe file:px-3 file:py-2 file:text-sm file:font-semibold file:text-preto"
      />
      <span className="mt-2 block text-xs leading-5 text-texto/70">{helpText || "JPG, PNG ou WEBP ate 5MB."}</span>
    </div>
  );
}
