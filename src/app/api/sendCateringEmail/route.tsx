// src/app/api/sendCateringEmail/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const {
      Name,
      Email,
      Phone,
      EventType,
      Date,
      Guests,
      Notes,
    } = await req.json(); 

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Southern Jerks Catering" <${process.env.SMTP_USER}>`,
      to: process.env.CATERING_EMAIL,
      subject: "New Catering Request",
      html: `
        <h2>New Catering Request</h2>
        <p><b>Name:</b> ${Name}</p>
        <p><b>Email:</b> ${Email}</p>
        <p><b>Phone:</b> ${Phone}</p>
        <p><b>Event Type:</b> ${EventType}</p>
        <p><b>Date:</b> ${Date}</p>
        <p><b>Guests:</b> ${Guests}</p>
        <p><b>Notes:</b> ${Notes || "None"}</p>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
