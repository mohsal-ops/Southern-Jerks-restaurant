"use client";

import AddProduct, { updateProduct } from "@/app/admin/_actions/products";
import PageHeader from "@/app/admin/_components/pageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";
import { Label } from "@radix-ui/react-label";
import { Item } from "generated/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  message: "",
};

export default function ProductForm({
  item,
  types,
}: {
  item: Item | null;
  types: any[] | undefined[];
}) {
  const [state, formAction, pending] = useActionState(
    item == null ? AddProduct : updateProduct.bind(null, item.id),
    initialState,
  );
  const [PriceInCents, setPriceInCents] = useState<number>(
    item?.priceInCents || 0,
  );
  const [CategoryId, setCategoryId] = useState<string>("");

  // New catering states
  const [isCaterable, setIsCaterable] = useState<boolean>(false);
  const [cateringPriceInCents, setCateringPriceInCents] = useState<number>(
    item?.cateringPriceInCents || 0,
  );


const { toast} = useToast();
  useEffect(() => {
    if (state?.message) {
      toast({
        variant:state.message === "item added succefuly" ? "default" : "destructive", description: `${state.message}`,
      });
    }
  }, [state]);


  return (
    <div className="lg:flex justify-center pb-10">
      <form action={formAction} className="space-y-4 lg:w-[80%] ">
        <PageHeader>add new</PageHeader>
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
        <div className="space-y-2">
          <Label htmlFor="description" className=" text-sm ">
            Description
          </Label>
          <Textarea
            required
            id="description"
            name="description"
            defaultValue={item?.description}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceInCents" className=" text-sm ">
            Price In Cents
          </Label>
          <Input
            type="number"
            required
            id="priceInCents"
            name="priceInCents"
            defaultValue={item?.priceInCents || 0}
            className="w-full h-8 border focus:outline-none focus:border-neutral-300 pl-2 border-neutral-200"
            onChange={(e) => setPriceInCents(Number(e.target.value) || 0)}
          />
          <div className="text-muted-foreground">
            {formatCurrency((PriceInCents || 0) / 100)}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image" className=" text-sm ">
            Image
          </Label>
          <Input
            type="file"
            id="image"
            name="image"
            required={item == null}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className=" text-sm ">
            select Category
          </Label>
          <Select
            onValueChange={async (value) => {
              const selectedType = await types?.find(
                (type) => type.id === value,
              );
              if (selectedType) {
                setCategoryId(selectedType.id);
              }
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {types?.length > 0 ? (
                types?.map((type) => (
                  <SelectItem
                    key={type.id}
                    className="hover:cursor-pointer"
                    value={type.id}
                  >
                    {type.name}
                  </SelectItem>
                ))
              ) : (
                <>No Categories</>
              )}
            </SelectContent>
          </Select>
          <Link href="/admin/menuCategories/new">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Plus className="w-4" />
              <p>add category</p>
            </span>
          </Link>

          {/* Hidden Input to send selected category */}
          <Input
            type="hidden"
            id="category"
            required
            name="category"
            value={CategoryId}
          />
        </div>

        {/* ✅ New Catering Section */}
        <div className="space-y-2 border-t pt-4">
          <Label className="flex justify-start items-center w-20  gap-2 text-sm cursor-pointer">
            <Input
              type="checkbox"
              name="isCaterable"
              checked={isCaterable}
              value="true"   // always "true" when checked
              onChange={(e) => setIsCaterable(e.target.checked)}
            />
            Available for Catering
          </Label>

          {isCaterable && (
            <div className="space-y-2">
              <div>
                <Label htmlFor="cateringDescription" className=" text-sm ">
                  Catering Dish Description
                </Label>
                <Textarea
                  id="cateringDescription"
                  name="cateringDescription"
                  defaultValue={item?.cateringDescription || ""}
                />
              </div>
              <div>
                <Label htmlFor="cateringPriceInCents" className=" text-sm ">
                  Catering Price In Cents
                </Label>
                <Input
                  type="number"
                  id="cateringPriceInCents"
                  name="cateringPriceInCents"
                  defaultValue={item?.cateringPriceInCents || 0}
                  className="w-full h-8 border focus:outline-none focus:border-neutral-300 pl-2 border-neutral-200"
                  onChange={(e) =>
                    setCateringPriceInCents(Number(e.target.value) || 0)
                  }
                />
                <div className="text-muted-foreground">
                  {formatCurrency((cateringPriceInCents || 0) / 100)}
                </div>
              </div>
            </div>
          )}
        </div>

        <Button variant='outline' disabled={pending || CategoryId == ""} type="submit">
          {pending ? "saving..." : "save"}
        </Button>
      </form>
    </div>
  );
}
