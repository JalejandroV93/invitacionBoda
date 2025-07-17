import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const {
      code,
      guestNumber,
      attending,
      guestCount,
      dietaryRestrictions,
      comments,
    } = await request.json();

    let guest;

    // Intentar encontrar el invitado por número + código (método preferido)
    if (guestNumber && code) {
      guest = await prisma.guest.findFirst({
        where: {
          guestNumber: parseInt(guestNumber),
          code: code,
        },
      });
    }
    // Fallback al método anterior (solo código) para compatibilidad
    else if (code) {
      guest = await prisma.guest.findUnique({
        where: { code },
      });
    } else {
      return NextResponse.json(
        { error: "Código o número de invitado y código son requeridos" },
        { status: 400 }
      );
    }

    if (!guest) {
      return NextResponse.json(
        { error: "Invitado no encontrado" },
        { status: 404 }
      );
    }

    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        hasResponded: true,
        attending,
        guestCount: attending ? guestCount : 0,
        dietaryRestrictions,
        comments,
        respondedAt: new Date(),
      },
    });

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
