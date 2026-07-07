import type { SupabaseClient } from "@supabase/supabase-js";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Envie uma imagem JPG, PNG ou WEBP.";
  if (file.size > MAX_SIZE) return "A imagem deve ter no maximo 5MB.";
  return null;
}

export async function uploadImage(supabase: SupabaseClient<any>, bucket: string, path: string, file: File) {
  const errorMessage = validateImageFile(file);
  if (errorMessage) throw new Error(errorMessage);

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fullPath = `${path}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(fullPath, file, {
    cacheControl: "3600",
    upsert: true
  });

  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(fullPath);
  return data.publicUrl;
}
