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
        <NavLink href="/admin/menuItems">Menu items</NavLink>
        <NavLink href="/admin/menuCategories">Menu Categories</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
        <NavLink href="/admin/places">Places</NavLink>
      </AdminNav>
      <div className="container  overflow-auto">{children}</div>
      <Toaster  />


    </>
  );
}
