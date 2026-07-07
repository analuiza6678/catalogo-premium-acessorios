"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Input } from "./Input";

type ImageUploadProps = {
  label: string;
  currentUrl?: string | null;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
};

export function ImageUpload({ label, currentUrl, multiple, onFilesChange }: ImageUploadProps) {
  return (
    <label className="block rounded-[24px] border border-dashed border-dourado/50 bg-bege p-4 transition hover:border-dourado">
      <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-preto">
        <ImagePlus size={18} className="text-dourado" />
        {label}
      </span>
      {currentUrl ? (
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl bg-white">
          <Image src={currentUrl} alt={label} fill className="object-cover" />
        </div>
      ) : null}
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={(event) => onFilesChange(Array.from(event.target.files ?? []))}
        className="cursor-pointer rounded-xl bg-white file:mr-3 file:rounded-full file:border-0 file:bg-rosa-bebe file:px-3 file:py-2 file:text-sm file:font-semibold file:text-preto"
      />
      <span className="mt-2 block text-xs text-texto/70">JPG, PNG ou WEBP ate 5MB.</span>
    </label>
  );
}
