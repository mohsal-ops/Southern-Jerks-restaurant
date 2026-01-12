import db from "@/db/db";
import { ok } from "assert";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // Parse the incoming JSON body
    const { name, lat, lng } = await req.json();

    if (!name || !lat || !lng) {
      return NextResponse.json({ error: "some of this place data is missing" }, { status: 400 });
    }

    const place = await db.location.findFirst({
      where: {
        name: name
      }
    })
    if (!place) {
      try {
        await db.location.create({
          data: { name, lat, lng },
        });

        return new Response('succefuly', { status: 200 })

      } catch (error) {
        console.error("Error while adding place:", error);
        return NextResponse.json(
          { error: "Error while adding place:" },
          { status: 500 }
        );

      }


    } else {

      return Response.error()

    }

    // Save to database


}
