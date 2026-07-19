"use server";

import db from "@/db/db";
import { revalidatePath } from "next/cache";

type ActionResult = { message?: string; error?: string };

// ── Image storage ────────────────────────────────────────────────────────────
// Same pattern as src/app/admin/_actions/products.ts — local fs in dev,
// Vercel Blob in production (filesystem is read-only on Vercel).
async function saveImage(file: File, folder = "gallery"): Promise<string> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const fs = await import("node:fs/promises");
    await fs.mkdir(`public/${folder}`, { recursive: true });
    const path = `/${folder}/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(`public${path}`, new Uint8Array(await file.arrayBuffer()));
    return path;
  } else {
    const { put } = await import("@vercel/blob");
    const blob = await put(
      `${folder}/${crypto.randomUUID()}-${file.name}`,
      file,
      { access: "public" }
    );
    return blob.url;
  }
}

async function deleteImageFile(url: string) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev && url.startsWith("/")) {
      const fs = await import("node:fs/promises");
      await fs.unlink(`public${url}`);
    } else if (url.startsWith("https://")) {
      const { del } = await import("@vercel/blob");
      await del(url);
    }
  } catch (err) {
    console.warn("Gallery image file delete failed, skipping:", err);
  }
}

export async function addGalleryImage(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const file = formData.get("image");
  const alt = String(formData.get("alt") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "That file isn't an image." };
  }

  try {
    const url = await saveImage(file);
    const maxOrder = await db.galleryImage.aggregate({ _max: { order: true } });

    await db.galleryImage.create({
      data: {
        url,
        alt,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { message: "Image added." };
  } catch (error) {
    console.error("addGalleryImage error:", error);
    return { error: "Failed to upload image." };
  }
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const image = await db.galleryImage.findUnique({ where: { id } });
  if (!image) return { error: "Image not found." };

  await deleteImageFile(image.url);
  await db.galleryImage.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { message: "Image deleted." };
}

export async function reorderGalleryImages(ids: string[]): Promise<ActionResult> {
  await Promise.all(
    ids.map((id, index) =>
      db.galleryImage.update({ where: { id }, data: { order: index } })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { message: "Order updated." };
}
