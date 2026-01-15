"use server";

import { z } from "zod";
import fs from "node:fs/promises";
import db from "@/db/db";
import { revalidatePath, revalidateTag } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size > 0 && file.type.startsWith("image/"),
  { message: "Must be an image" }
);

const DataSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  image: imageSchema,
});

export default async function AddPost(  prevSatate: unknown,
formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries());

    const result = DataSchema.safeParse(raw);
    if (!result.success) {
      console.log(result.error.issues);
      return { error: Object.assign({}, result.error.issues) };
    }

    await fs.mkdir("public/blogImages", { recursive: true });
    const image = `/blogImages/${crypto.randomUUID()}-${result.data.image.name}`;
    await fs.writeFile(
      `public${image}`,
      new Uint8Array(await result.data.image.arrayBuffer())
    );

    await db.post.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        image,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/menuItems");
    revalidatePath("/Menu");
    revalidateTag("products");

    return { message: "Post added successfully" };
  } catch (error) {
    console.error(error);
    return {error, message: "Something went wrong" };
  }
}
