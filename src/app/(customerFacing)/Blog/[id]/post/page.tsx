import Image from "next/image";
import db from "@/db/db";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  const post = await db.post.findUnique({
    where: { id: id },
  });

  if (!post) return {};

  return {
    title: `${post.title} | Southern Jerks Journal`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function Post({ params }: PageProps) {
  const { id } = await params;

  const post = await db.post.findUnique({
    where: { id: id },
  });

  if (!post) return notFound();

  return (
    <article className="min-h-screen  bg-[#0f0f0f] text-white">
      {/* HERO */}
      <section className="relative  w-screen sm:w-[80vw] h-[80vh] flex items-end">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-contain opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 p-10 max-w-4xl">
          <Link href="/Blog" className="text-sm text-[#f4b400] hover:underline">
            ← Back to Journal
          </Link>

          <h1 className="text-3xl md:text-5xl font-bold mt-4 leading-tight">
            {post.title}
          </h1>
          <div className="prose p-2 prose-invert prose-lg max-w-none">
          <p className="text-md text-gray-300 leading-relaxed">
            {post.description}
          </p>
        </div>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 leading-relaxed">
            {post.content}
          </p>
        </div>
      </section>

      {/* BRAND SIGNATURE */}
      <section className="bg-[#161616] py-16 text-center">
        <h3 className="text-2xl font-bold text-[#f4b400]">
          Southern Jerks Journal
        </h3>
        <p className="mt-3 text-gray-400">
          Caribbean heat. Brooklyn hustle. Global flavor.
        </p>

        <Link
          href="/Menu"
          className="inline-block mt-6 px-6 py-3 bg-[#f4b400] 
                     text-black font-semibold rounded-full hover:scale-105 transition"
        >
          View Menu →
        </Link>
      </section>
    </article>
  );
}
