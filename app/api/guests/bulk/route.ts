import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCsvData } from "@/lib/utils/csvParser";
import {
  generateUniqueCode,
  generateUniqueGuestNumber,
} from "@/lib/utils/generateCode";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { csvData } = await request.json();

    if (!csvData) {
      return NextResponse.json(
        { error: "CSV data is required" },
        { status: 400 }
      );
    }

    const parsedData = await parseCsvData(csvData);
    const createdGuests = [];

    for (const guestData of parsedData) {
      const code = guestData.code || (await generateUniqueCode());
      const guestNumber = await generateUniqueGuestNumber();

      const guest = await prisma.guest.create({
        data: {
          name: guestData.name,
          code,
          guestNumber,
        },
      });

      createdGuests.push(guest);
    }

    return NextResponse.json({
      message: `Successfully created ${createdGuests.length} guests`,
      guests: createdGuests,
    });
  } catch (error) {
    console.error("Error creating bulk guests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
