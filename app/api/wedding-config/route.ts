import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let config = await prisma.weddingConfig.findFirst();

    if (!config) {
      // Crear configuración por defecto si no existe
      config = await prisma.weddingConfig.create({
        data: {
          brideName: "Novia",
          groomName: "Novio",
          weddingDate: new Date("2024-12-31"),
          ceremonyLocation: "Iglesia",
          ceremonyAddress: "Dirección de la ceremonia",
          receptionLocation: "Salón de fiestas",
          receptionAddress: "Dirección de la recepción",
          welcomeMessage: "¡Nos casamos!",
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching wedding config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    let config = await prisma.weddingConfig.findFirst();

    if (config) {
      // Actualizar configuración existente
      config = await prisma.weddingConfig.update({
        where: { id: config.id },
        data: {
          brideName: data.brideName,
          groomName: data.groomName,
          weddingDate: data.weddingDate
            ? new Date(data.weddingDate)
            : undefined,
          ceremonyLocation: data.ceremonyLocation,
          ceremonyAddress: data.ceremonyAddress,
          ceremonyMapIframe: data.ceremonyMapIframe,
          receptionLocation: data.receptionLocation,
          receptionAddress: data.receptionAddress,
          receptionMapIframe: data.receptionMapIframe,
          backgroundImage: data.backgroundImage,
          brideImage: data.brideImage,
          groomImage: data.groomImage,
          coupleImage: data.coupleImage,
          welcomeMessage: data.welcomeMessage,
          ourStory: data.ourStory,
        },
      });
    } else {
      // Crear nueva configuración
      config = await prisma.weddingConfig.create({
        data: {
          brideName: data.brideName || "Novia",
          groomName: data.groomName || "Novio",
          weddingDate: data.weddingDate
            ? new Date(data.weddingDate)
            : new Date(),
          ceremonyLocation: data.ceremonyLocation || "Iglesia",
          ceremonyAddress: data.ceremonyAddress || "Dirección de la ceremonia",
          ceremonyMapIframe: data.ceremonyMapIframe,
          receptionLocation: data.receptionLocation || "Salón de fiestas",
          receptionAddress:
            data.receptionAddress || "Dirección de la recepción",
          receptionMapIframe: data.receptionMapIframe,
          backgroundImage: data.backgroundImage,
          brideImage: data.brideImage,
          groomImage: data.groomImage,
          coupleImage: data.coupleImage,
          welcomeMessage: data.welcomeMessage || "¡Nos casamos!",
          ourStory: data.ourStory,
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error updating wedding config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
