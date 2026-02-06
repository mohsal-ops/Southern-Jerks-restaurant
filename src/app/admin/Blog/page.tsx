import getAllTypes from "@/app/admin/menuCategories/_action/gettypes";
import AddPostForm from "./_components/AddPostForm";

export default async function Blog() {
  const types = await getAllTypes();

  return (
    <div className="px-3 ">
      <AddPostForm post={null} />
    </div>
  );
}
