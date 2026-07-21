import { Toaster } from "@/components/ui/sonner";
import { AdminNav } from "./_components/nav";
import db from "@/db/db";

export const dynamic = "force-dynamic";

export default async function Adminlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Surfaced as a badge on the Catering nav item so pending requests are
  // visible from any admin page, not just the dashboard.
  const newCateringCount = await db.cateringRequest.count({
    where: { status: "new" },
  });

  return (
    <div className="min-h-screen bg-stone-50 md:flex">
      <AdminNav newCateringCount={newCateringCount} />
      <main id="main-content" className="min-w-0 flex-1 overflow-auto pt-14 md:pt-0">
        {children}
      </main>
      <Toaster expand richColors closeButton duration={6000} />
    </div>
  );
}
