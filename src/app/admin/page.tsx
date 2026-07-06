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
} from "lucide-react";
import { ReactNode } from "react";
import TrafficSourceChart from "./_components/charts/trafficSources";

const isUnlocked = true; // 🔒 flip to true when ready

const HOURS = [
  { day: "Sunday",    open: 11, close: 16 },
  { day: "Monday",    open: null, close: null },
  { day: "Tuesday",   open: 11, close: 21 },
  { day: "Wednesday", open: 11, close: 21 },
  { day: "Thursday",  open: 11, close: 21 },
  { day: "Friday",    open: 11, close: 21 },
  { day: "Saturday",  open: 12, close: 20 },
];

function getHoustonStatus() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const today = HOURS[day];
  if (!today.open) return { isOpen: false, label: "Closed today", next: "Opens Tuesday 11:00 AM" };
  if (hour >= today.open && hour < today.close!) {
    const h = today.close!;
    return { isOpen: true, label: "Open now", next: `Closes at ${h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}` };
  }
  return { isOpen: false, label: "Currently closed", next: `Opens at ${today.open > 12 ? `${today.open - 12}:00 PM` : `${today.open}:00 AM`}` };
}

async function getDashboardData() {
  const [totalItems, activeItems, inactiveItems, totalCategories, totalPosts, latestPost, totalLocations, featuredItems] =
    await Promise.all([
      db.item.count(),
      db.item.count({ where: { isAvailableForPurchase: true } }),
      db.item.count({ where: { isAvailableForPurchase: false } }),
      db.types.count(),
      db.post.count(),
      db.post.findFirst({ orderBy: { createdAt: "desc" }, select: { title: true, createdAt: true } }),
      db.location.count(),
      db.item.count({ where: { isAvailableForPurchase: true } }),
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
  return { totalItems, activeItems, inactiveItems, totalCategories, totalPosts, latestPost, totalLocations, featuredItems, seoScore };
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
          </div>
        </div>

        {/* STAT CARDS */}
        <div>
          <SectionTitle>Overview</SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

// src/app/admin/analytics/page.tsx

// import {
//   getTrafficData,
//   getEngagementData,
//   getTrafficSources,
//   getTopPages,
//   getConversionData,
//   getDeviceData,
//   getSeoData,
//   getPageSpeedData,
// } from "@/lib/analytics";
// import { TrendingUp, TrendingDown } from "lucide-react";

// // ── Delta pill ──────────────────────────────────────────────
// function Delta({ value, unit = "%" }: { value: number; unit?: string }) {
//   if (value > 0)
//     return (
//       <span className="inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-800">
//         <TrendingUp className="w-3 h-3" /> +{value}{unit}
//       </span>
//     );
//   if (value < 0)
//     return (
//       <span className="inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">
//         <TrendingDown className="w-3 h-3" /> {value}{unit}
//       </span>
//     );
//   return null;
// }

// // ── Big stat card ────────────────────────────────────────────
// function StatCard({
//   label, value, delta, deltaUnit, accent, sub,
// }: {
//   label: string; value: string | number; delta?: number;
//   deltaUnit?: string; accent?: string; sub?: string;
// }) {
//   return (
//     <div className={`rounded-2xl p-5 flex flex-col gap-2 ${accent ?? "bg-muted/60"}`}>
//       <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
//       <p className="text-3xl font-semibold tracking-tight leading-none">{value}</p>
//       <div className="flex items-center gap-2 min-h-[20px]">
//         {delta !== undefined && <Delta value={delta} unit={deltaUnit} />}
//         {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
//       </div>
//     </div>
//   );
// }

// // ── Section header ───────────────────────────────────────────
// function SectionHead({ icon, title, source }: { icon: string; title: string; source: string }) {
//   return (
//     <div className="flex items-center justify-between mb-4">
//       <div className="flex items-center gap-2">
//         <span className="text-lg">{icon}</span>
//         <h2 className="text-base font-semibold">{title}</h2>
//       </div>
//       <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">
//         {source}
//       </span>
//     </div>
//   );
// }

// // ── Rank badge ───────────────────────────────────────────────
// function RankBadge({ pos }: { pos: number }) {
//   if (pos <= 3) return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">#{pos} 🔥</span>;
//   if (pos <= 10) return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">#{pos}</span>;
//   return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">#{pos}</span>;
// }

// // ── Bar ──────────────────────────────────────────────────────
// function Bar({ pct, color }: { pct: number; color: string }) {
//   return (
//     <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
//       <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
//     </div>
//   );
// }

// // ── Page ─────────────────────────────────────────────────────
// export default async function AnalyticsPage() {
//   const [traffic, engagement, sources, topPages, conversions, devices, seo, speed] =
//     await Promise.all([
//       getTrafficData(), getEngagementData(), getTrafficSources(),
//       getTopPages(), getConversionData(), getDeviceData(),
//       getSeoData(), getPageSpeedData(),
//     ]);

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-10 pb-20">

//       {/* ── Header ─────────────────────────────────────────── */}
//       <div className="flex items-end justify-between border-b pb-5">
//         <div>
//           <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">Restaurant dashboard</p>
//           <h1 className="text-2xl font-bold tracking-tight">Website Analytics</h1>
//         </div>
//         <span className="text-xs text-muted-foreground">Last 30 days</span>
//       </div>

//       {/* ── Traffic ────────────────────────────────────────── */}
//       <section>
//         <SectionHead icon="📈" title="Traffic" source="Google Analytics" />
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//           <StatCard label="Unique visitors" value={traffic.uniqueVisitors.toLocaleString()} delta={traffic.uniqueVisitorsDelta} deltaUnit="%" accent="bg-blue-50 dark:bg-blue-950/30" />
//           <StatCard label="Total visits" value={traffic.totalVisits.toLocaleString()} delta={traffic.totalVisitsDelta} deltaUnit="%" />
//           <StatCard label="Page views" value={traffic.pageViews.toLocaleString()} delta={traffic.pageViewsDelta} deltaUnit="%" />
//           <StatCard label="Bounce rate" value={`${traffic.bounceRate}%`} delta={traffic.bounceRateDelta} deltaUnit=" pts" sub="lower = better" />
//         </div>
//       </section>

//       {/* ── Traffic Sources + Engagement side by side ───────── */}
//       <div className="grid lg:grid-cols-2 gap-6">

//         {/* Sources */}
//         <section className="rounded-2xl border p-5">
//           <p className="text-sm font-semibold mb-4">Where visitors come from</p>
//           <div className="space-y-3">
//             {sources.length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
//             {sources.map((s) => (
//               <div key={s.name} className="flex items-center gap-3">
//                 <span className="text-xs text-muted-foreground w-28 shrink-0">{s.name}</span>
//                 <Bar pct={s.percentage} color={s.color} />
//                 <span className="text-xs font-semibold w-8 text-right tabular-nums">{s.percentage}%</span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Engagement */}
//         <section className="rounded-2xl border p-5">
//           <p className="text-sm font-semibold mb-4">How people engage</p>
//           <div className="grid grid-cols-2 gap-3">
//             {[
//               { label: "Avg session", value: engagement.avgSessionDuration, sub: "target 3min+" },
//               { label: "Pages/session", value: String(engagement.pagesPerSession), sub: "higher = better" },
//               { label: "Return visitors", value: `${engagement.returningVisitors}%`, sub: "loyalty" },
//               { label: "Top exit page", value: engagement.topExitPage, sub: `${engagement.exitRate}% leave here` },
//             ].map((item) => (
//               <div key={item.label} className="bg-muted/50 rounded-xl p-3">
//                 <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
//                 <p className="text-base font-semibold truncate">{item.value}</p>
//                 <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>

//       {/* ── Top Pages ────────────────────────────────────────── */}
//       <section>
//         <SectionHead icon="📄" title="Top pages" source="Google Analytics" />
//         <div className="rounded-2xl border overflow-hidden">
//           <div className="grid grid-cols-[1fr_80px_100px_80px] text-[11px] uppercase tracking-widest text-muted-foreground font-medium bg-muted/40 px-5 py-2.5 border-b">
//             <span>Page</span><span className="text-right">Views</span>
//             <span className="text-right">Avg time</span><span className="text-right">Exit</span>
//           </div>
//           {topPages.length === 0 && (
//             <p className="px-5 py-4 text-sm text-muted-foreground">No page data yet</p>
//           )}
//           {topPages.map((page, i) => (
//             <div
//               key={page.page}
//               className={`grid grid-cols-[1fr_80px_100px_80px] px-5 py-3 items-center text-sm ${
//                 i < topPages.length - 1 ? "border-b" : ""
//               }`}
//             >
//               <span className="font-mono text-xs text-muted-foreground truncate pr-4">{page.page}</span>
//               <span className="text-right font-medium tabular-nums">{page.views.toLocaleString()}</span>
//               <span className="text-right text-muted-foreground tabular-nums">{page.avgTime}</span>
//               <span className={`text-right font-medium tabular-nums ${page.exitRate > 35 ? "text-red-600" : "text-muted-foreground"}`}>
//                 {page.exitRate}%
//               </span>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── SEO ──────────────────────────────────────────────── */}
//       <section>
//         <SectionHead icon="🔍" title="SEO" source="Search Console" />

//         {/* 4 big stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//           <StatCard label="Organic clicks" value={seo.organicTraffic.toLocaleString()} accent="bg-green-50 dark:bg-green-950/30" />
//           <StatCard label="Impressions" value={seo.impressions.toLocaleString()} />
//           <StatCard label="Click-through rate" value={`${seo.ctr}%`} sub="avg across all searches" />
//           <StatCard label="Avg position" value={`#${seo.avgPosition}`} sub="Google ranking" accent={seo.avgPosition <= 10 ? "bg-amber-50 dark:bg-amber-950/30" : undefined} />
//         </div>

//         {/* Keywords */}
//         <div className="rounded-2xl border overflow-hidden">
//           <div className="px-5 py-3 border-b bg-muted/40">
//             <p className="text-sm font-semibold">Keyword rankings</p>
//           </div>
//           <div className="grid grid-cols-[1fr_70px_60px_60px_80px] text-[11px] uppercase tracking-widest text-muted-foreground font-medium bg-muted/20 px-5 py-2 border-b">
//             <span>Keyword</span><span className="text-center">Position</span>
//             <span className="text-right">Clicks</span><span className="text-right">CTR</span>
//             <span className="text-right">Rank</span>
//           </div>
//           {seo.keywords.length === 0 && (
//             <p className="px-5 py-4 text-sm text-muted-foreground">No keyword data yet</p>
//           )}
//           {seo.keywords.map((kw, i) => (
//             <div
//               key={kw.keyword}
//               className={`grid grid-cols-[1fr_70px_60px_60px_80px] px-5 py-3 items-center text-sm ${
//                 i < seo.keywords.length - 1 ? "border-b" : ""
//               }`}
//             >
//               <span className="truncate pr-4 font-medium">{kw.keyword}</span>
//               <span className="text-center"><RankBadge pos={kw.position} /></span>
//               <span className="text-right tabular-nums text-muted-foreground">{kw.clicks}</span>
//               <span className="text-right tabular-nums text-muted-foreground">{kw.ctr}%</span>
//               <div className="flex justify-end">
//                 <RankBadge pos={kw.position} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── Conversions + Device + Speed ─────────────────────── */}
//       <div className="grid lg:grid-cols-3 gap-6">

//         {/* Conversions */}
//         <section className="rounded-2xl border p-5">
//           <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Conversions</p>
//           <div className="space-y-4">
//             <div>
//               <p className="text-3xl font-bold">{conversions.conversionRate}%</p>
//               <p className="text-xs text-muted-foreground mt-1">conversion rate</p>
//             </div>
//             <div className="border-t pt-4">
//               <p className="text-2xl font-semibold">{conversions.goalCompletions.toLocaleString()}</p>
//               <div className="flex items-center gap-2 mt-1">
//                 <p className="text-xs text-muted-foreground">goal completions</p>
//                 {conversions.goalsDelta !== 0 && <Delta value={conversions.goalsDelta} unit="" />}
//               </div>
//             </div>
//             <div className="border-t pt-4">
//               <p className="text-xl font-semibold">{speed.performanceScore}/100</p>
//               <p className="text-xs text-muted-foreground mt-1">PageSpeed score</p>
//             </div>
//           </div>
//         </section>

//         {/* Devices */}
//         <section className="rounded-2xl border p-5">
//           <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Devices</p>
//           {devices.length === 0 ? (
//             <p className="text-sm text-muted-foreground">No device data yet</p>
//           ) : (
//             <div className="space-y-4">
//               {devices.map((d) => (
//                 <div key={d.label}>
//                   <div className="flex justify-between items-baseline mb-1.5">
//                     <span className="text-sm font-medium">{d.label}</span>
//                     <span className="text-xl font-bold tabular-nums">{d.value}%</span>
//                   </div>
//                   <Bar pct={d.value} color={d.color} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Page Speed */}
//         <section className="rounded-2xl border p-5">
//           <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Page speed</p>
//           {speed.loadSpeed === null ? (
//             <div className="space-y-2">
//               <p className="text-sm text-muted-foreground">Not connected</p>
//               <p className="text-xs text-muted-foreground leading-relaxed">
//                 Add <code className="bg-muted px-1 rounded">PAGESPEED_API_KEY</code> to <code className="bg-muted px-1 rounded">.env.local</code> to see load speed, FCP, LCP, CLS.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div>
//                 <p className="text-3xl font-bold">{speed.loadSpeed}s</p>
//                 <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
//                   speed.loadSpeed < 3 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                 }`}>
//                   {speed.loadSpeed < 3 ? "Good" : "Needs work"}
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-2 border-t pt-4">
//                 {[
//                   { label: "FCP", value: speed.fcp },
//                   { label: "LCP", value: speed.lcp },
//                   { label: "CLS", value: speed.cls },
//                   { label: "TBT", value: speed.tbt },
//                 ].map((m) => (
//                   <div key={m.label} className="bg-muted/50 rounded-lg p-2 text-center">
//                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</p>
//                     <p className="text-sm font-semibold mt-0.5">{m.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </section>
//       </div>

//     </div>
//   );
// }