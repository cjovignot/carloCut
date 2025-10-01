// src/services/uploadImage.ts
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");

  return data.url; // URL finale Cloudinary
};
