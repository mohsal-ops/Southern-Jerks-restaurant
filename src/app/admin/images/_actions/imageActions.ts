"use server";
import db from "@/db/db";
import { revalidatePath } from "next/cache";

// Same dev-local-fs / prod-Vercel-Blob pattern as src/app/admin/_actions/AddProduct.ts.
async function saveImage(file: File): Promise<string> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const fs = await import("node:fs/promises");
    await fs.mkdir("public/site-images", { recursive: true });
    const path = `/site-images/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(`public${path}`, new Uint8Array(await file.arrayBuffer()));
    return path;
  } else {
    const { put } = await import("@vercel/blob");
    const blob = await put(`site-images/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
    });
    return blob.url;
  }
}

export async function updateSiteImage(key: string, formData: FormData) {
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return { error: "No file provided" };
  if (!file.type.startsWith("image/")) return { error: "Invalid image file" };

  const url = await saveImage(file);
  await db.siteImage.update({ where: { key }, data: { url } });

  revalidatePath("/");
  revalidatePath("/story");
  revalidatePath("/admin/images");
  return { ok: true, url };
}
