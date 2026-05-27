// lib/analytics.ts
// ─────────────────────────────────────────────────────────
// Real data fetching for GA4, Search Console, PageSpeed
// Run once: npm install @google-analytics/data googleapis
// ─────────────────────────────────────────────────────────

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { google } from "googleapis";

const credentials = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
  private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY!;
const SITE_URL = process.env.SITE_URL!; // e.g. https://yourrestaurant.com

// ── GA4 client ────────────────────────────────────────────
const ga4 = new BetaAnalyticsDataClient({ credentials });

// ── Search Console client ─────────────────────────────────
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});
const searchconsole = google.searchconsole({ version: "v1", auth });

// ─────────────────────────────────────────────────────────
// 1. Traffic overview (GA4)
// ─────────────────────────────────────────────────────────
export async function getTrafficData() {
  
  const [current, previous] = await Promise.all([
    ga4.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
      ],
    }),
    ga4.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
      ],
    }),
  ]);

  const cur = current[0].rows?.[0]?.metricValues;
  const prev = previous[0].rows?.[0]?.metricValues;

  const delta = (c: number, p: number) =>
    p === 0 ? 0 : Math.round(((c - p) / p) * 100);

  const uv = parseInt(cur?.[0]?.value ?? "0");
  const tv = parseInt(cur?.[1]?.value ?? "0");
  const pv = parseInt(cur?.[2]?.value ?? "0");
  const br = Math.round(parseFloat(cur?.[3]?.value ?? "0") * 100);

  const uvP = parseInt(prev?.[0]?.value ?? "0");
  const tvP = parseInt(prev?.[1]?.value ?? "0");
  const pvP = parseInt(prev?.[2]?.value ?? "0");
  const brP = Math.round(parseFloat(prev?.[3]?.value ?? "0") * 100);

  return {
    uniqueVisitors: uv,
    totalVisits: tv,
    pageViews: pv,
    bounceRate: br,
    uniqueVisitorsDelta: delta(uv, uvP),
    totalVisitsDelta: delta(tv, tvP),
    pageViewsDelta: delta(pv, pvP),
    bounceRateDelta: br - brP, // points change (negative = improved)
  };
}

// ─────────────────────────────────────────────────────────
// 2. Engagement (GA4)
// ─────────────────────────────────────────────────────────
export async function getEngagementData() {

  const [engagement, exitPages, newVsReturn] = await Promise.all([
    ga4.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "averageSessionDuration" },
        { name: "screenPageViewsPerSession" },
      ],
    }),
    ga4.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "bounceRate" }],
      orderBys: [{ metric: { metricName: "bounceRate" }, desc: true }],
      limit: 1,
    }),
    ga4.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "newVsReturning" }],
      metrics: [{ name: "activeUsers" }],
    }),
  ]);

  const engRow = engagement[0].rows?.[0]?.metricValues;
  const rawSeconds = parseFloat(engRow?.[0]?.value ?? "0");
  const minutes = Math.floor(rawSeconds / 60);
  const seconds = Math.round(rawSeconds % 60);

  const exitRow = exitPages[0].rows?.[0];
  const topExitPage = exitRow?.dimensionValues?.[0]?.value ?? "/";
  const exitRate = Math.round(
    parseFloat(exitRow?.metricValues?.[0]?.value ?? "0") * 100
  );

  const rows = newVsReturn[0].rows ?? [];
  const returning = rows.find(
    (r) => r.dimensionValues?.[0]?.value === "returning"
  );
  const newUsers = rows.find(
    (r) => r.dimensionValues?.[0]?.value === "new"
  );
  const retCount = parseInt(returning?.metricValues?.[0]?.value ?? "0");
  const newCount = parseInt(newUsers?.metricValues?.[0]?.value ?? "0");
  const total = retCount + newCount;
  const returningPct = total === 0 ? 0 : Math.round((retCount / total) * 100);

  return {
    avgSessionDuration: `${minutes}m ${seconds}s`,
    pagesPerSession: parseFloat(
      parseFloat(engRow?.[1]?.value ?? "0").toFixed(1)
    ),
    returningVisitors: returningPct,
    topExitPage,
    exitRate,
  };
}

// ─────────────────────────────────────────────────────────
// 3. Traffic sources (GA4)
// ─────────────────────────────────────────────────────────
export async function getTrafficSources() {
  const [response] = await ga4.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  const rows = response.rows ?? [];
  const totalSessions = rows.reduce(
    (sum, r) => sum + parseInt(r.metricValues?.[0]?.value ?? "0"),
    0
  );

  const colorMap: Record<string, string> = {
    "Organic Search": "bg-blue-500",
    Direct: "bg-emerald-600",
    "Organic Social": "bg-orange-500",
    Referral: "bg-amber-600",
    Email: "bg-gray-400",
    Paid: "bg-purple-500",
  };

  return rows.slice(0, 6).map((row) => {
    const name = row.dimensionValues?.[0]?.value ?? "Other";
    const sessions = parseInt(row.metricValues?.[0]?.value ?? "0");
    return {
      name,
      percentage:
        totalSessions === 0 ? 0 : Math.round((sessions / totalSessions) * 100),
      color: colorMap[name] ?? "bg-gray-400",
    };
  });
}

// ─────────────────────────────────────────────────────────
// 4. Top pages (GA4)
// ─────────────────────────────────────────────────────────
export async function getTopPages() {
  const [response] = await ga4.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "sessions" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 8,
  });

  return (response.rows ?? []).map((row) => {
    const rawSecs = parseFloat(row.metricValues?.[1]?.value ?? "0");
    const m = Math.floor(rawSecs / 60);
    const s = Math.round(rawSecs % 60);
    return {
      page: row.dimensionValues?.[0]?.value ?? "/",
      views: parseInt(row.metricValues?.[0]?.value ?? "0"),
      avgTime: `${m}m ${s}s`,
      exitRate:0,
    };
  });
}

// ─────────────────────────────────────────────────────────
// 5. Conversions (GA4)
// ─────────────────────────────────────────────────────────
export async function getConversionData() {
  const [conv, prevConv] = await Promise.all([
    ga4.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "conversions" },
        { name: "sessionConversionRate" },
        // "form_submission" counts reservation form completions
      ],
    }),
    ga4.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }],
      metrics: [{ name: "conversions" }],
    }),
  ]);

  const curRow = conv[0].rows?.[0]?.metricValues;
  const prevCount = parseInt(
    prevConv[0].rows?.[0]?.metricValues?.[0]?.value ?? "0"
  );
  const goals = parseInt(curRow?.[0]?.value ?? "0");

  return {
    conversionRate: parseFloat(
      (parseFloat(curRow?.[1]?.value ?? "0") * 100).toFixed(1)
    ),
    goalCompletions: goals,
    goalsDelta: goals - prevCount,
  };
}

// ─────────────────────────────────────────────────────────
// 6. Device breakdown (GA4)
// ─────────────────────────────────────────────────────────
export async function getDeviceData() {
  const [response] = await ga4.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "sessions" }],
  });

  const rows = response.rows ?? [];
  const total = rows.reduce(
    (s, r) => s + parseInt(r.metricValues?.[0]?.value ?? "0"),
    0
  );

  const colorMap: Record<string, string> = {
    mobile: "bg-blue-500",
    desktop: "bg-emerald-600",
    tablet: "bg-gray-400",
  };

  return rows.map((row) => {
    const label = row.dimensionValues?.[0]?.value ?? "other";
    const sessions = parseInt(row.metricValues?.[0]?.value ?? "0");
    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value: total === 0 ? 0 : Math.round((sessions / total) * 100),
      color: colorMap[label] ?? "bg-gray-400",
    };
  });
}

// ─────────────────────────────────────────────────────────
// 7. SEO — Search Console
// ─────────────────────────────────────────────────────────
export async function getSeoData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];

  const [overview, keywords] = await Promise.all([
    searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: [],
      },
    }),
    searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 10,
       
      },
    }),
  ]);

  const ov = overview.data.rows?.[0];

  return {
    organicTraffic: Math.round(ov?.clicks ?? 0),
    impressions: Math.round(ov?.impressions ?? 0),
    ctr: parseFloat(((ov?.ctr ?? 0) * 100).toFixed(1)),
    avgPosition: parseFloat((ov?.position ?? 0).toFixed(1)),
    keywords: (keywords.data.rows ?? []).map((row) => ({
      keyword: (row.keys?.[0] ?? "").toLowerCase(),
      position: Math.round(row.position ?? 0),
      clicks: Math.round(row.clicks ?? 0),
      ctr: parseFloat(((row.ctr ?? 0) * 100).toFixed(1)),
    })),
  };
}

// ─────────────────────────────────────────────────────────
// 8. PageSpeed Insights
// ─────────────────────────────────────────────────────────
export async function getPageSpeedData() {
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    SITE_URL
  )}&key=${PAGESPEED_API_KEY}&strategy=mobile&category=performance`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
  const data = await res.json();

  const lhr = data.lighthouseResult;
  const audits = lhr?.audits;

  return {
    performanceScore: Math.round((lhr?.categories?.performance?.score ?? 0) * 100),
    loadSpeed: parseFloat(
      (audits?.["interactive"]?.numericValue / 1000).toFixed(1)
    ),
    fcp: audits?.["first-contentful-paint"]?.displayValue ?? "–",
    lcp: audits?.["largest-contentful-paint"]?.displayValue ?? "–",
    cls: audits?.["cumulative-layout-shift"]?.displayValue ?? "–",
    tbt: audits?.["total-blocking-time"]?.displayValue ?? "–",
  };
}