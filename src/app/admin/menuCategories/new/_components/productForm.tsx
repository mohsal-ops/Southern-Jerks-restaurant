"use client";

import { AddCategory } from "@/app/admin/_actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { Item } from "generated/prisma";
import { useActionState, useEffect } from "react";
import Link from "next/link";

const initialState = {
  message: "",
};
export default function ProductForm({ item }: { item: Item | null }) {
  const [state, formAction, pending] = useActionState(
    AddCategory,
    initialState,
  );
  useEffect(() => {
    const s = state as any;
    const msg = s?.message ?? (s?.error ? "Please enter a valid category name." : "");
    if (!msg) return;
    if (/added|success|updated/i.test(msg)) toast.success(msg);
    else toast.error(msg);
  }, [state]);

  return (
    <>
      <form action={formAction} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name" className=" text-sm ">
            Name
          </Label>
          <Input
            type="text"
            required
            id="name"
            name="name"
            defaultValue={item?.name}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="mainButton" size="md" disabled={pending} type="submit">
            {pending ? "Saving…" : "Add category"}
          </Button>
          <Link href="/admin/menuCategories">
            <Button type="button" variant="outline" size="md">Back to categories</Button>
          </Link>
        </div>
      </form>
    </>
  );
}
