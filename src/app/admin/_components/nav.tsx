"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Users,
  ShoppingBag,
  BookOpen,
  MapPin,
  Newspaper,
  ChartArea,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: ChartArea },
  { href: "/admin/menuItems", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/menuCategories", label: "Categories", icon: Tag },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/orders", label: "Sales", icon: ShoppingBag },
  { href: "/admin/story", label: "Our Story", icon: Newspaper },
  { href: "/admin/Blog", label: "Blog", icon: BookOpen },
  { href: "/admin/places", label: "Places", icon: MapPin },
  { href: "/admin/team", label: "Team", icon: ShieldCheck },
];

export function AdminNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProfileActive = pathname.startsWith("/admin/profile");

  return (
    <nav className="bg-stone-900 text-white flex items-center px-4 gap-1 h-14 border-b border-stone-800">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6">
        <div className="w-7 h-7 rounded-lg bg-[#c85a1e] flex items-center justify-center">
          <span className="text-white text-xs font-bold">SJ</span>
        </div>
        <span className="text-sm font-semibold text-stone-200 hidden sm:block">
          Southern Jerks
        </span>
      </div>
      <div className="flex items-center gap-1 flex-1">{children}</div>
      <Link
        href="/admin/profile"
        aria-label="Your profile"
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
          isProfileActive
            ? "bg-[#c85a1e] text-white"
            : "text-stone-400 hover:text-white hover:bg-stone-800"
        )}
      >
        <UserCircle size={18} />
      </Link>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  const isActive =
    props.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(props.href as string);

  const item = navItems.find((n) => n.href === props.href);
  const Icon = item?.icon;

  return (
    <Link
      {...props}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-[#c85a1e] text-white"
          : "text-stone-400 hover:text-white hover:bg-stone-800"
      )}
    >
      {Icon && <Icon size={14} />}
      <span className="hidden md:block">{item?.label ?? props.children}</span>
    </Link>
  );
}