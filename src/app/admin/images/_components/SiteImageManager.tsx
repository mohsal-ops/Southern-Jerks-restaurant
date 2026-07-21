"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateSiteImage } from "../_actions/imageActions";

type SiteImageRow = { id: string; key: string; url: string; label: string };

function ImageCard({ image }: { image: SiteImageRow }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = () => {
    if (!file) return;
    const formData = new FormData();
    formData.set("image", file);
    startTransition(async () => {
      const res = await updateSiteImage(image.key, formData);
      if (res.ok) {
        toast.success(`${image.label} updated`);
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        toast.error(res.error ?? "Failed to update image");
      }
    });
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3">
      <p className="font-semibold text-stone-800 text-sm">{image.label}</p>
      <div className="relative w-full max-w-[200px] h-[150px] rounded-xl overflow-hidden bg-stone-100">
        {(preview ?? image.url) ? (
          <Image
            src={preview ?? image.url}
            alt={image.label}
            fill
            className="object-cover"
            unoptimized={!!preview}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
            No image set
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" type="button" onClick={() => inputRef.current?.click()}>
          Change Image
        </Button>
        {file && (
          <>
            <Button variant="mainButton" size="sm" disabled={isPending} onClick={handleSave}>
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button variant="ghost" size="sm" disabled={isPending} onClick={handleCancel}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SiteImageManager({ images }: { images: SiteImageRow[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 md:px-0">
      {images.map((img) => (
        <ImageCard key={img.id} image={img} />
      ))}
    </div>
  );
}
