"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode, useState } from "react";
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
  Images,
  Star,
  Menu,
  X,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/siteConfig";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: ChartArea },
  { href: "/admin/menuItems", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/menuCategories", label: "Categories", icon: Tag },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/orders", label: "Sales", icon: ShoppingBag },
  { href: "/admin/story", label: "Our Story", icon: Newspaper },
  { href: "/admin/Blog", label: "Blog", icon: BookOpen },
  // { href: "/admin/gallery", label: "Gallery", icon: Images },
  // { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/places", label: "Places", icon: MapPin },
  { href: "/admin/team", label: "Team", icon: ShieldCheck },
];

export function AdminNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProfileActive = pathname.startsWith("/admin/profile");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop navbar — unchanged, hidden on mobile */}
      <nav className="hidden md:flex bg-stone-900 text-white items-center px-4 gap-1 h-14 border-b border-stone-800">
        <div className="flex items-center gap-2 mr-6">
          <div className="w-7 h-7 rounded-lg bg-[#c85a1e] flex items-center justify-center">
            <span className="text-white text-xs font-bold">SJ</span>
          </div>
          <span className="text-sm font-semibold text-stone-200 hidden sm:block">
            {SITE_CONFIG.name}
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

      {/* Mobile top bar — just a hamburger, fixed top-left */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-3 bg-stone-900 text-white border-b border-stone-800">
        <button
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-stone-200 hover:bg-stone-800"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#c85a1e] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">SJ</span>
          </div>
          <span className="text-sm font-semibold text-stone-200">{SITE_CONFIG.name}</span>
        </div>
        <Link
          href="/admin/profile"
          aria-label="Your profile"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-stone-300"
        >
          <UserCircle size={18} />
        </Link>
      </div>

      {/* Mobile slide-in sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 max-w-[80vw] bg-stone-900 text-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between h-14 px-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#c85a1e] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">SJ</span>
                </div>
                <span className="text-sm font-semibold text-stone-200">{SITE_CONFIG.name}</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#c85a1e] text-white"
                        : "text-stone-400 hover:text-white hover:bg-stone-800"
                    )}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
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