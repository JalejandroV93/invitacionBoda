import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateUniqueCode,
  generateUniqueGuestNumber,
} from "@/lib/utils/generateCode";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { guestNumber: "asc" }, // Ordenar por número de invitado
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error("Error fetching guests:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, code, guestNumber } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const guestCode = code || (await generateUniqueCode());
    const guestNum = guestNumber || (await generateUniqueGuestNumber());

    const guest = await prisma.guest.create({
      data: {
        name,
        code: guestCode,
        guestNumber: guestNum,
      },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Error creating guest:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
