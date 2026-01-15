"use client";

import PageHeader from "@/app/admin/_components/pageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Post } from "generated/prisma";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AddPost from "../../_actions/AddPost";

interface AddPostFormProps {
  post: Post | null;
}

export default function AddPostForm({ post }: AddPostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [image, setImage] = useState<File | null>(null);

  const [state, formAction, pending] = useActionState(AddPost, { message: "" });
  const { toast } = useToast();

  // Show server errors as toast
  useEffect(() => {
    console.log(state);
    if (state?.message && !state.message.includes("added")) {
      toast({ variant: "destructive", description: state.message });
    }else{
        toast({ variant: "default", description: state.message });
    }
  }, [state]);

  // Client-side validation
  const isTitleValid = title.trim().length >= 5;
  const isDescriptionValid = description.trim().length >= 10;
  const isImageValid = post ? true : image !== null;

  const isFormValid = isTitleValid && isDescriptionValid && isImageValid;

  

  return (
    <div className="lg:flex justify-center pb-10">
      <form action={formAction} className="space-y-4 lg:w-[80%]">
        <PageHeader>{post ? "Edit Post" : "Add Post"}</PageHeader>

        <div className="space-y-1">
          <Label htmlFor="title" className="text-sm">
            Title
          </Label>
          <Input
            name="title"  
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className={!isTitleValid ? "border-red-500" : ""}
          />
          {!isTitleValid && (
            <p className="text-red-500 text-xs">Title must be at least 5 characters</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-sm">
            Description
          </Label>
          <Textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={5}
            className={!isDescriptionValid ? "border-red-500" : ""}
          />
          {!isDescriptionValid && (
            <p className="text-red-500 text-xs">
              Description must be at least 20 characters
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="image" className="text-sm">
            Image
          </Label>
          <Input
            name="image"
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className={!isImageValid ? "border-red-500" : ""}
          />
          {!isImageValid && (
            <p className="text-red-500 text-xs">Image is required</p>
          )}
        </div>

        <Button variant="outline" type="submit" disabled={pending || !isFormValid}>
          {pending ? "Saving..." : post ? "Update Post" : "Add Post"}
        </Button>
      </form>
    </div>
  );
}
