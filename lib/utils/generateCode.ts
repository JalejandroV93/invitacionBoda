import { prisma } from "../prisma";

export async function generateUniqueCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate 6-character alphanumeric code
    code = generateAlphanumericCode(6);

    // Check if code exists in database
    const existingGuest = await prisma.guest.findUnique({
      where: { code },
    });

    if (!existingGuest) {
      isUnique = true;
      return code;
    }
  }

  throw new Error("Unable to generate unique code");
}

export async function generateUniqueGuestNumber(): Promise<number> {
  let guestNumber: number;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random number between 1000 and 9999
    guestNumber = Math.floor(1000 + Math.random() * 9000);

    // Check if guest number exists in database
    const existingGuest = await prisma.guest.findUnique({
      where: { guestNumber },
    });

    if (!existingGuest) {
      isUnique = true;
      return guestNumber;
    }
  }

  throw new Error("Unable to generate unique guest number");
}

function generateAlphanumericCode(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
