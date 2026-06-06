import db from "@/db/db";
import StoryClient from "./_components/StoryClient";

export default async function Page() {
  const partners = await db.partner.findMany({
    orderBy: { order: "asc" },
  });

  return <StoryClient partners={partners} />;
}