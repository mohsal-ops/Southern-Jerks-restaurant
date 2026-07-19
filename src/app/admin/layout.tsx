import { Toaster } from "@/components/ui/sonner";
import { AdminNav, NavLink } from "./_components/nav";

export default function Adminlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dynamic = "force-dynamic";
  return (
    <>
      <AdminNav>
        <NavLink href="/admin">Dashbord</NavLink>
        <NavLink href="/admin/analytics">Analytics</NavLink>
        <NavLink href="/admin/menuItems">Menu items</NavLink>
        <NavLink href="/admin/menuCategories">Menu Categories</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
        <NavLink href="/admin/Blog">Blog</NavLink>
        <NavLink href="/admin/story">Our Story</NavLink>
        {/* <NavLink href="/admin/gallery">Gallery</NavLink>
        <NavLink href="/admin/reviews">Reviews</NavLink> */}
        <NavLink href="/admin/places">Places</NavLink>
        <NavLink href="/admin/team">Team</NavLink>
      </AdminNav>
      <div id="main-content" className="container pt-14 md:pt-0 overflow-auto">{children}</div>
      <Toaster expand richColors closeButton duration={6000} />
    </>
  );
}
