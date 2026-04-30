import { SidebarProvider } from "@/components/ui/sidebar";
import { TopNavBar } from "./_components/navBar";
import { Footer } from "./page";
import { Toaster } from "sonner";
import { cookies } from "next/headers";

export default async function Customerlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dynamic = "force-dynamic";
  const cartId = (await cookies()).get("cart_id")?.value ?? null;

  return (
    <SidebarProvider>
      <main className="flex relative flex-col w-full  pb- ">
        <div className="fixed top-0 left-0 right-0 z-50">
          <TopNavBar initialCartId={cartId} />
        </div>
        <div className="flex flex-col md:items-center   ">{children}</div>
        <div className="flex flex-col w-full items-center ">
          <Footer />
          <div className="text-xs  mt-2 text-black text-center p-4 md:py-3 bg-stone-200 w-full border-t border-white/10">
            © {new Date().getFullYear()} Southern Jerks. All Rights Reserved.
            Website by{" "}
            <a
              href="https://www.instagram.com/vegastar.digital/"
              target="_blank"
              className="underline hover:text-primary"
            >
              Vega Star Digital
            </a>{" "}
            — MOHAMMED BENSALAH
          </div>
        </div>
      </main>
      <Toaster
        position="top-center"
        theme="light"
        expand
        richColors
        closeButton
        duration={4000}
      />
    </SidebarProvider>
  );
}
