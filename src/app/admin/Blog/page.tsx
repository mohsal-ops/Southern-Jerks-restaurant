import PageHeader from "@/app/admin/_components/pageHeader";
import AddPostForm from "./_components/AddPostForm";
import PostsTable from "./_components/PostsTable";
import db from "@/db/db";

export default async function BlogPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col  justify-center bg-stone-100 p-2 sm:px-16 pb-10">
      <div className="lg:w-[85%] ">
        <PageHeader>Blog</PageHeader>
        <p className="text-sm mt-2 text-muted-foreground mb-6">
          Create and manage blog posts
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  w-full ">
        {/* LEFT – CREATE POST */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <AddPostForm post={null} />
          </div>
        </div>

        {/* RIGHT – SIDEBAR */}
        <div className="space-y-6">
          <PostsTable posts={posts} />
          <BlogTips />
        </div>
      </div>
    </div>
  );
}

function BlogTips() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="font-semibold mb-3">Blog Tips</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Use catchy titles</li>
        <li>• Add eye-catching images</li>
        <li>• Keep paragraphs short</li>
        <li>• Include calls-to-action</li>
        <li>• Post consistently</li>
      </ul>
    </div>
  );
}
