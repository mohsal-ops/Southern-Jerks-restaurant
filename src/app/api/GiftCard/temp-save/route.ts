// app/api/GiftCard/save-temp/route.ts
import { NextResponse } from "next/server";

let tempStorage: Record<string, any> = {};

export async function POST(req: Request) {
  const { fromName, fromEmail, toName, toEmail, note, price } = await req.json();

  if (!fromName || !fromEmail || !toName || !toEmail || !price) {
    return NextResponse.json({ error: "Missing required form fields" }, { status: 400 });
  }

  // Generate a temporary ID or store in DB
  const tempId = Date.now().toString();  // Use actual DB in production

  // Save the form data temporarily (in memory, replace with DB in production)
  tempStorage[tempId] = { fromName, fromEmail, toName, toEmail, note, price };

  // Return a response with the tempId
  return NextResponse.json({ tempId });
}
