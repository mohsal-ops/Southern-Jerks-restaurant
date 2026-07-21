"use server";
import db from "@/db/db";
import { revalidatePath } from "next/cache";

export async function updateBusinessHours(
  hours: { dayIndex: number; open: number | null; close: number | null }[],
) {
  for (const h of hours) {
    await db.businessHours.update({
      where: { dayIndex: h.dayIndex },
      data: { open: h.open, close: h.close },
    });
  }
  revalidatePath("/");
  revalidatePath("/Menu");
  revalidatePath("/admin");
  revalidatePath("/admin/hours");
  return { ok: true };
}
