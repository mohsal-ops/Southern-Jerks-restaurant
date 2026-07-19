import db from "@/db/db";
import Link from "next/link";
import {
  PenLine,
  UtensilsCrossed,
  MapPin,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Star,
  BookOpen,
  Zap,
  Images,
} from "lucide-react";
import { ReactNode } from "react";
import TrafficSourceChart from "./_components/charts/trafficSources";
import { SITE_CONFIG } from "@/lib/siteConfig";

const isUnlocked = true; // 🔒 flip to true when ready

function getHoustonStatus() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: SITE_CONFIG.timezone })
  );
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const today = SITE_CONFIG.hours[day];
  if (!today.open) return { isOpen: false, label: "Closed today", next: "Opens Tuesday 11:00 AM" };
  if (hour >= today.open && hour < today.close!) {
    const h = today.close!;
    return { isOpen: true, label: "Open now", next: `Closes at ${h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}` };
  }
  return { isOpen: false, label: "Currently closed", next: `Opens at ${today.open > 12 ? `${today.open - 12}:00 PM` : `${today.open}:00 AM`}` };
}

async function getDashboardData() {
  const [totalItems, activeItems, inactiveItems, totalCategories, totalPosts, latestPost, totalLocations, featuredItems, totalGalleryImages, totalReviews] =
    await Promise.all([
      db.item.count(),
      db.item.count({ where: { isAvailableForPurchase: true } }),
      db.item.count({ where: { isAvailableForPurchase: false } }),
      db.types.count(),
      db.post.count(),
      db.post.findFirst({ orderBy: { createdAt: "desc" }, select: { title: true, createdAt: true } }),
      db.location.count(),
      db.item.count({ where: { isAvailableForPurchase: true } }),
      db.galleryImage.count(),
      db.review.count(),
    ]);

  let seoScore = 0;
  if (totalPosts >= 1)  seoScore += 20;
  if (totalPosts >= 5)  seoScore += 20;
  if (totalPosts >= 10) seoScore += 10;
  if (activeItems >= 10) seoScore += 15;
  if (featuredItems >= 3) seoScore += 10;
  if (totalLocations >= 1) seoScore += 15;
  if (latestPost) {
    const d = Math.floor((Date.now() - new Date(latestPost.createdAt).getTime()) / 86400000);
    if (d <= 7) seoScore += 10;
    else if (d <= 30) seoScore += 5;
  }
  return { totalItems, activeItems, inactiveItems, totalCategories, totalPosts, latestPost, totalLocations, featuredItems, totalGalleryImages, totalReviews, seoScore };
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">{children}</h2>;
}

function StatCard({ label, value, sub, icon, accent }: { label: string; value: string | number; sub?: string; icon: ReactNode; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 relative overflow-hidden">
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10" style={{ background: accent }} />
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: accent + "18", color: accent }}>{icon}</div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <p className="text-xs font-medium text-stone-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

function SEOTip({ done, text, action, href }: { done: boolean; text: string; action?: string; href?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-stone-50 last:border-0">
      <div className="mt-0.5 flex-shrink-0">
        {done ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-stone-300" />}
      </div>
      <p className={`flex-1 text-sm ${done ? "text-stone-600" : "text-stone-400"}`}>{text}</p>
      {!done && href && action && (
        <Link href={href} className="text-xs font-semibold text-[#c85a1e] hover:underline flex-shrink-0">{action} →</Link>
      )}
    </div>
  );
}

export default async function Page() {
  const data = await getDashboardData();
  const houstonStatus = getHoustonStatus();
  const daysSincePost = data.latestPost
    ? Math.floor((Date.now() - new Date(data.latestPost.createdAt).getTime()) / 86400000)
    : null;
  const seoColor = data.seoScore >= 70 ? "#1a6b3c" : data.seoScore >= 40 ? "#d97706" : "#dc2626";

  return (
    <>
      {/* ── PAGE CONTENT — blur only this, navbar is in layout so untouched ── */}
      <div
        className={
          isUnlocked
            ? "min-h-screen bg-stone-50 p-6 space-y-8"
            : "min-h-screen bg-stone-50 p-6 space-y-8 blur-sm pointer-events-none select-none"
        }
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
            <p className="text-sm text-stone-500 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2 shadow-sm">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${houstonStatus.isOpen ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
            <span className="text-sm font-medium text-stone-700">{houstonStatus.label}</span>
            <span className="text-xs text-stone-400">{houstonStatus.next}</span>
          </div>
        </div>

        {/* ALERTS */}
        {data.inactiveItems > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">{data.inactiveItems} menu item{data.inactiveItems > 1 ? "s" : ""} currently unavailable</p>
              <p className="text-xs text-amber-600 mt-0.5">Customers can see these but can&apos;t order them</p>
            </div>
            <Link href="/admin/menuItems" className="text-xs font-semibold text-amber-700 flex items-center gap-1">Fix <ArrowRight size={12} /></Link>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/admin/Blog" className="group bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:border-[#c85a1e] hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#c85a1e] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><PenLine size={18} /></div>
              <p className="font-semibold text-stone-800 text-sm">Write Blog Post</p>
              <p className="text-xs text-stone-400 mt-1">{daysSincePost === null ? "No posts yet — start now" : daysSincePost === 0 ? "Last post: today ✓" : `Last post: ${daysSincePost}d ago`}</p>
            </Link>
            <Link href="/admin/menuItems/new" className="group bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:border-[#1a6b3c] hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-green-50 text-[#1a6b3c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><UtensilsCrossed size={18} /></div>
              <p className="font-semibold text-stone-800 text-sm">Add Menu Item</p>
              <p className="text-xs text-stone-400 mt-1">{data.totalItems} items · {data.totalCategories} categories</p>
            </Link>
            <Link href="/admin/places" className="group bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:border-[#1d4ed8] hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><MapPin size={18} /></div>
              <p className="font-semibold text-stone-800 text-sm">Manage Locations</p>
              <p className="text-xs text-stone-400 mt-1">{data.totalLocations} location{data.totalLocations !== 1 ? "s" : ""} on the map</p>
            </Link>
            {/* <Link href="/admin/gallery" className="group bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:border-[#7c3aed] hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Images size={18} /></div>
              <p className="font-semibold text-stone-800 text-sm">Manage Gallery</p>
              <p className="text-xs text-stone-400 mt-1">{data.totalGalleryImages} photo{data.totalGalleryImages !== 1 ? "s" : ""} on the home page</p>
            </Link>
            <Link href="/admin/reviews" className="group bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:border-[#d97706] hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Star size={18} /></div>
              <p className="font-semibold text-stone-800 text-sm">Manage Reviews</p>
              <p className="text-xs text-stone-400 mt-1">{data.totalReviews} testimonial{data.totalReviews !== 1 ? "s" : ""} shown</p>
            </Link> */}
          </div>
        </div>

        {/* STAT CARDS */}
        <div>
          <SectionTitle>Overview</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Blog Posts" value={data.totalPosts} sub={data.latestPost ? `Last: "${data.latestPost.title.slice(0, 22)}..."` : "No posts yet"} icon={<BookOpen size={16} />} accent="#c85a1e" />
            <StatCard label="Active Menu Items" value={data.activeItems} sub={`${data.inactiveItems} unavailable`} icon={<UtensilsCrossed size={16} />} accent="#1a6b3c" />
            <StatCard label="Featured Items" value={data.featuredItems} sub="Shown on home page" icon={<Star size={16} />} accent="#d97706" />
            <StatCard label="Locations" value={data.totalLocations} sub="On the map" icon={<MapPin size={16} />} accent="#1d4ed8" />
          </div>
        </div>

        {/* SEO + TRAFFIC */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">SEO Health</p>
                <p className="font-semibold text-stone-800">How Google sees your site</p>
              </div>
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={seoColor} strokeWidth="3" strokeDasharray={`${data.seoScore} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color: seoColor }}>{data.seoScore}</span>
                </div>
              </div>
            </div>
            <SEOTip done={data.totalPosts >= 1} text="At least 1 blog post published" action="Write post" href="/admin/Blog" />
            <SEOTip done={data.totalPosts >= 5} text="5+ blog posts (boosts ranking significantly)" action="Write post" href="/admin/Blog" />
            <SEOTip done={data.totalPosts >= 10} text="10+ blog posts (establishes content authority)" action="Write post" href="/admin/Blog" />
            <SEOTip done={daysSincePost !== null && daysSincePost <= 7} text="Posted within the last 7 days (freshness signal)" action="Write now" href="/admin/Blog" />
            <SEOTip done={data.activeItems >= 10} text="10+ active menu items visible on site" action="Add items" href="/admin/menuItems/new" />
            <SEOTip done={data.featuredItems >= 3} text="3+ featured items on home page" action="Set featured" href="/admin/menuItems" />
            <SEOTip done={data.totalLocations >= 1} text="Location added (helps local SEO in Houston)" action="Add location" href="/admin/places" />
            <div className="mt-4 bg-stone-50 rounded-xl p-3 flex gap-2">
              <Zap size={14} className="text-[#c85a1e] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-stone-500 leading-relaxed">
                <span className="font-semibold text-stone-700">Pro tip:</span>{" "}
                Posting 2–3 blog posts per week is the single biggest thing you can do to rank higher on Google.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Traffic Sources</p>
            <p className="font-semibold text-stone-800 mb-6">Where your visitors come from</p>
            <TrafficSourceChart />
          </div>
        </div>

        {/* BLOG ACTIVITY */}
        <div>
          <SectionTitle>Blog Activity</SectionTitle>
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#c85a1e] flex items-center justify-center"><TrendingUp size={16} /></div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{data.totalPosts} post{data.totalPosts !== 1 ? "s" : ""} published</p>
                  <p className="text-xs text-stone-400">
                    {data.latestPost ? `Last: "${data.latestPost.title}" — ${daysSincePost === 0 ? "today" : `${daysSincePost} days ago`}` : "No posts yet — start writing to get found on Google"}
                  </p>
                </div>
              </div>
              <Link href="/admin/Blog" className="text-xs font-semibold text-[#c85a1e] hover:underline flex items-center gap-1">Manage <ArrowRight size={12} /></Link>
            </div>
            <div className="border-t border-stone-100 pt-4 grid grid-cols-3 gap-3">
              {[
                { freq: "1–2×/week", label: "Good",      color: "#d97706", bg: "#fef3c7" },
                { freq: "3–4×/week", label: "Great",     color: "#1a6b3c", bg: "#dcfce7" },
                { freq: "5+×/week",  label: "Excellent", color: "#1d4ed8", bg: "#dbeafe" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: item.bg }}>
                  <p className="text-sm font-bold" style={{ color: item.color }}>{item.freq}</p>
                  <p className="text-xs mt-0.5" style={{ color: item.color }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MENU HEALTH */}
        <div>
          <SectionTitle>Menu Health</SectionTitle>
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-stone-100">
              <div className="p-6 text-center">
                <p className="text-3xl font-bold text-green-600">{data.activeItems}</p>
                <p className="text-xs text-stone-500 mt-1 font-medium">Available</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-3xl font-bold text-red-500">{data.inactiveItems}</p>
                <p className="text-xs text-stone-500 mt-1 font-medium">Unavailable</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-3xl font-bold text-stone-800">{data.featuredItems}</p>
                <p className="text-xs text-stone-500 mt-1 font-medium">Featured</p>
              </div>
            </div>
            <div className="px-6 pb-5">
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.totalItems > 0 ? (data.activeItems / data.totalItems) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {data.totalItems > 0 ? `${Math.round((data.activeItems / data.totalItems) * 100)}% of menu currently available` : "No items yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── OVERLAY — fixed so it sits above page content but below the layout navbar ── */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto"
          style={{ top: "56px" }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
              <span className="text-3xl">🚧</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900">Dashboard Coming Soon</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              We&apos;re building you a powerful admin dashboard — SEO tools, blog management, menu control, and live analytics. Almost ready.
            </p>
            <div className="w-full">
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-[#c85a1e] rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-stone-400 mt-2">Progress: 80% complete</p>
            </div>
            <p className="text-xs text-stone-400">
              Questions? Email{" "}
              <a href="mailto:popdeveloper54@gmail.com" className="text-[#c85a1e] hover:underline font-medium">
                popdeveloper54@gmail.com
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
