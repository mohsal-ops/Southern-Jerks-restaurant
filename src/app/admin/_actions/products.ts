"use server";

import { z } from "zod";
import fs from "node:fs/promises";
import db from "@/db/db";
import { notFound } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";



const fileSchema = z.instanceof(File, { error: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
);




const addSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  priceInCents: z.coerce.number().int().min(1),
  category: z
    .string()
    .min(1)
    .refine((val) => !val.startsWith("[object]"), {
      error: "Invalid category format",
    }),
  isCaterable: z.preprocess(
    (val) => val === "true",
    z.boolean()
  ),

  cateringDescription: z.string().optional(),
  cateringPriceInCents: z.coerce.number().optional(),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});
export default async function AddProduct(
  prevSatate: unknown,
  formData: FormData,
) {
  try {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
      console.log(result.error.issues)


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
    const image = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${image}`,
      new Uint8Array(await data.image.arrayBuffer()),
    );


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
    revalidateTag('products')
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
  if (data.image != null && data.image.size > 0) {
    try {
      await fs.unlink(`public${item.image}`);
      image = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.writeFile(
        `public${image}`,
        new Uint8Array(await data.image.arrayBuffer()),
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

  revalidatePath("/");
  revalidateTag('products')
  revalidatePath("/Menu");
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
    revalidateTag('categorries')
    revalidatePath("/Menu");
    return { message: "item added succefuly" };
  } catch (error: any) {
    // ✅ Check if it's a unique constraint error (Prisma error code P2002)
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
export async function toglleFeaturing(
  id: string,
  isFeatured: boolean,
) {
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
  revalidateTag("categorries");
  revalidatePath("/admin/menuCategories");
}


