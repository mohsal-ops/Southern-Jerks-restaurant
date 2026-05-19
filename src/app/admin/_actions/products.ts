"use server";

import { z } from "zod";
import fs from "node:fs/promises";
import db from "@/db/db";
import { notFound } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

const fileSchema = z.instanceof(File, { error: "Required" });
const imageSchema = z
  .instanceof(File)
  .optional()
  .refine(
    (file) => !file || file.size === 0 || file.type.startsWith("image/"),
    { message: "Invalid image file" },
  );

const addSchema = z.object({
  name: z.string().min(2),

  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.union([z.string().min(2), z.undefined()]),
  ),

  priceInCents: z.coerce.number().int().min(1),

  category: z
    .string()
    .min(1)
    .refine((val) => !val.startsWith("[object]"), {
      error: "Invalid category format",
    }),

  isCaterable: z.preprocess((val) => val === "true", z.boolean()).optional(),

  cateringDescription: z
    .preprocess((val) => (val === "" ? undefined : val), z.string())
    .optional(),

  cateringPriceInCents: z.coerce.number().optional(),

  image: imageSchema.optional(),
});

export default async function AddProduct(
  prevSatate: unknown,
  formData: FormData,
) {
  try {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
      console.log(result.error.issues);

      return {
        error: Object.assign({}, result.error.issues),
      };
    }
    function createSlug(arg: string) {
      return arg
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") as string;
    }
    const slugExistiong = async (slug: string) => {
      return await db.item.findUnique({ where: { slug: slug } });
    };

    const slug = createSlug(result.data.name);
    if (await slugExistiong(slug)) {
      return { message: "name already exist" };
    }

    const data = { ...result.data, slug };

    await fs.mkdir("public/products", { recursive: true });
    const file = data.image;

    const isValidImage =
      file && file.size > 0 && file.type.startsWith("image/");

    const image = isValidImage
      ? `/products/${crypto.randomUUID()}-${file.name}`
      : null;

    if (isValidImage) {
      await fs.writeFile(
        `public${image}`,
        new Uint8Array(await file.arrayBuffer()),
      );
    }

    await db.item.create({
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        slug: data.slug,
        typeId: data.category,
        isCaterable: data.isCaterable,
        cateringDescription: data.cateringDescription,
        cateringPriceInCents: data.cateringPriceInCents,
        image,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/menuItems");
    revalidatePath("/Menu");
    revalidateTag("products");
    return { message: "item added succefuly" };
  } catch (error) {
    return { message: error };
  }
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData,
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return { error: result.error.issues };
  }

  const data = result.data;
  const item = await db.item.findUnique({ where: { id } });
  if (item == null) return notFound();

  let image = item.image;
  const file = data.image;

  const isValidImage = file && file.size > 0 && file.type.startsWith("image/");

  if (isValidImage) {
    try {
      if (item.image) {
        await fs.unlink(`public${item.image}`);
      }

      image = `/products/${crypto.randomUUID()}-${file.name}`;

      await fs.writeFile(
        `public${image}`,
        new Uint8Array(await file.arrayBuffer()),
      );
    } catch (err) {
      console.warn("File delete failed, skipping", err);
    }
  }

  await db.item.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      image,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/menuItems");
  revalidatePath("/Menu");
  revalidateTag("products");
}

const categorySchema = z.object({
  name: z.string().min(1),
});
export async function AddCategory(prevSatate: unknown, formData: FormData) {
  try {
    const result = categorySchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (result.success === false) {
      return { error: result.error.issues };
    }

    function createSlug(arg: string) {
      return arg
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") as string;
    }

    const slug = createSlug(result.data.name);

    const data = { ...result.data, slug };

    await db.types.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    revalidatePath("/");
    revalidateTag("categories");
    revalidatePath("/Menu");
    return { message: "item added succefuly" };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return {
        message: "This name already exists. Please choose a different one.",
      };
    }

    return { message: error };
  }
}

export async function toglleAvalability(
  id: string,
  isAvailableForPurchase: boolean,
) {
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

export async function addItemSides(
  itemId: string,
  groups: SideGroupInput[]
) {

  try {
    // Remove old groups (safe re-save)
  await db.sideGroup.deleteMany({
    where: { itemId },
  });



  // Create new groups
  for (const group of groups) {
    if (!group.options.length) continue
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
     return { message: error };
    
  }
 return { ok: true };
}


