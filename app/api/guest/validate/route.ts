import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const guestNumber = searchParams.get("guestNumber");

  // Mantener compatibilidad con el método anterior (solo código)
  if (code && !guestNumber) {
    try {
      const guest = await prisma.guest.findUnique({
        where: { code },
      });

      if (!guest) {
        return NextResponse.json(
          { error: "Código no válido" },
          { status: 404 }
        );
      }

      return NextResponse.json(guest);
    } catch (error) {
      console.error("Error validating guest:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  // Nuevo método: número de invitado + código
  if (!guestNumber || !code) {
    return NextResponse.json(
      { error: "Número de invitado y código son requeridos" },
      { status: 400 }
    );
  }

  try {
    const guest = await prisma.guest.findFirst({
      where: {
        guestNumber: parseInt(guestNumber),
        code: code,
      },
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Número de invitado o código no válidos" },
        { status: 404 }
      );
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Error validating guest:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
