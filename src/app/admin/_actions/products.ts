"use server";

import { z } from "zod";
import db from "@/db/db";
import { notFound } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

// ── Image storage ────────────────────────────────────────────────────────────
// On Vercel, the filesystem is READ-ONLY - fs.writeFile will silently fail.
// We use Vercel Blob (free tier: 1GB) in production, and local fs in dev.
// Setup: run `npm install @vercel/blob` then add BLOB_READ_WRITE_TOKEN to
// your Vercel project settings (Storage → Blob → Connect → copy token).

async function saveImage(file: File, folder = "products"): Promise<string> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // Local dev - write to public folder as before
    const fs = await import("node:fs/promises");
    await fs.mkdir(`public/${folder}`, { recursive: true });
    const path = `/${folder}/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(`public${path}`, new Uint8Array(await file.arrayBuffer()));
    return path;
  } else {
    // Production (Vercel) - upload to Vercel Blob
    const { put } = await import("@vercel/blob");
    const blob = await put(
      `${folder}/${crypto.randomUUID()}-${file.name}`,
      file,
      { access: "public" }
    );
    return blob.url; // full https:// URL
  }
}

async function deleteImage(imagePath: string) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev && imagePath.startsWith("/")) {
      const fs = await import("node:fs/promises");
      await fs.unlink(`public${imagePath}`);
    } else if (imagePath.startsWith("https://")) {
      const { del } = await import("@vercel/blob");
      await del(imagePath);
    }
  } catch (err) {
    console.warn("Image delete failed, skipping:", err);
  }
}

// ── Schemas ──────────────────────────────────────────────────────────────────
const imageSchema = z
  .instanceof(File)
  .optional()
  .refine(
    (file) => !file || file.size === 0 || file.type.startsWith("image/"),
    { message: "Invalid image file" }
  );

const addSchema = z.object({
  name: z.string().min(2),
  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.union([z.string().min(2), z.undefined()])
  ),
  price: z.coerce.number().positive({ message: "Enter a price greater than 0" }),
  category: z
    .string()
    .min(1)
    .refine((val) => !val.startsWith("[object]"), {
      message: "Invalid category format",
    }),
  isCaterable: z.preprocess((val) => val === "true", z.boolean()).optional(),
  cateringDescription: z
    .preprocess((val) => (val === "" ? undefined : val), z.string())
    .optional(),
  cateringPrice: z.coerce.number().optional(),
  image: imageSchema.optional(),
});

const editSchema = addSchema.extend({
  image: imageSchema.optional(),
});

// ── Add product ──────────────────────────────────────────────────────────────
export default async function AddProduct(
  prevState: unknown,
  formData: FormData
) {
  try {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
      console.log("Validation errors:", result.error.issues);
      return { error: Object.assign({}, result.error.issues) };
    }

    const { data } = result;

    // Build a UNIQUE slug so items with the same/similar name still save
    // (append -2, -3, … instead of rejecting the duplicate).
    const base =
      data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "item";
    let slug = base;
    let n = 1;
    while (await db.item.findUnique({ where: { slug } })) slug = `${base}-${++n}`;

    // Handle image
    const file = data.image;
    const isValidImage = file && file.size > 0 && file.type.startsWith("image/");
    const image = isValidImage ? await saveImage(file) : null;

    await db.item.create({
      data: {
        name: data.name,
        description: data.description,
        priceInCents: Math.round(data.price * 100),
        slug,
        typeId: data.category,
        isCaterable: data.isCaterable,
        cateringDescription: data.cateringDescription,
        cateringPriceInCents: data.cateringPrice ? Math.round(data.cateringPrice * 100) : null,
        image,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/menuItems");
    revalidatePath("/Menu");
    revalidateTag("products");
    return { message: "item added succefuly" };
  } catch (error) {
    console.error("AddProduct error:", error);
    return { message: String(error) };
  }
}

// ── Update product ───────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) return { error: result.error.issues };

  const { data } = result;
  const item = await db.item.findUnique({ where: { id } });
  if (!item) return notFound();

  let image = item.image;
  const file = data.image;
  const isValidImage = file && file.size > 0 && file.type.startsWith("image/");

  if (isValidImage) {
    if (item.image) await deleteImage(item.image);
    image = await saveImage(file);
  }

  await db.item.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: Math.round(data.price * 100),
      isCaterable: data.isCaterable,
      cateringDescription: data.cateringDescription,
      cateringPriceInCents: data.cateringPrice ? Math.round(data.cateringPrice * 100) : null,
      image,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/menuItems");
  revalidatePath("/Menu");
  revalidateTag("products");
  return { message: "item updated successfully" };
}

// ── Category actions ─────────────────────────────────────────────────────────
const categorySchema = z.object({ name: z.string().min(1) });

export async function AddCategory(prevState: unknown, formData: FormData) {
  try {
    const result = categorySchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) return { error: result.error.issues };

    function createSlug(str: string) {
      return str.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    const slug = createSlug(result.data.name);
    await db.types.create({ data: { name: result.data.name, slug } });

    revalidatePath("/");
    revalidateTag("categories");
    revalidatePath("/Menu");
    return { message: "item added succefuly" };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return { message: "This name already exists. Please choose a different one." };
    }
    return { message: String(error) };
  }
}

// ── Item status toggles ──────────────────────────────────────────────────────
export async function toglleAvalability(id: string, isAvailableForPurchase: boolean) {
  await db.item.update({ where: { id }, data: { isAvailableForPurchase } });
  revalidatePath("/");
  revalidatePath("/Menu");
  revalidateTag("products");
  revalidatePath("/admin/menuItems");
}

export async function toglleFeaturing(id: string, isFeatured: boolean) {
  await db.item.update({ where: { id }, data: { featured: isFeatured } });
  revalidatePath("/");
  revalidateTag("featured-products");
  revalidatePath("/Menu");
  revalidatePath("/admin/menuItems");
}

export async function DeleteMenuItem(id: string) {
  const item = await db.item.findUnique({ where: { id } });
  if (item?.image) await deleteImage(item.image);
  await db.item.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/Menu");
  revalidateTag("products");
  revalidatePath("/admin/menuItems");
}

export async function DeleteCategory(id: string) {
  await db.types.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/Menu");
  revalidateTag("categories");
  revalidatePath("/admin/menuCategories");
}

// ── Sides ────────────────────────────────────────────────────────────────────
type SideGroupInput = {
  title: string;
  type: "RECOMMENDED" | "NO" | "EXTRA" | "SPICE";
  required?: boolean;
  maxSelect?: number | null;
  options: {
    label?: string;
    priceInCents?: number | null;
    linkedItemId?: string;
  }[];
};

export async function addItemSides(itemId: string, groups: SideGroupInput[]) {
  try {
    await db.sideGroup.deleteMany({ where: { itemId } });

    for (const group of groups) {
      if (!group.options.length) continue;
      await db.sideGroup.create({
        data: {
          itemId,
          title: group.title,
          type: group.type,
          required: group.required ?? false,
          maxSelect: group.maxSelect ?? null,
          options: {
            create: group.options.map((opt) => ({
              label: opt.label ?? "",
              priceInCents: opt.priceInCents ?? null,
              linkedItemId: opt.linkedItemId ?? null,
            })),
          },
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/menuItems");
    revalidatePath("/Menu");
    revalidateTag("products");
    return { message: "group added successfully" };
  } catch (error) {
    console.error("Error adding sides:", error);
    return { message: String(error) };
  }
}