import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const analytics = google.analyticsdata("v1beta");

export async function GET(req: NextRequest) {
  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY!);

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsClient = await analytics.properties.runReport({
      property: "properties/479278566", // your GA property ID
      auth,
      requestBody: {
        dimensions: [{ name: "sessionDefaultChannelGrouping" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      },
    });

    return NextResponse.json(analyticsClient.data);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
