import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalGuests = await prisma.guest.count();
    const respondedGuests = await prisma.guest.count({
      where: { hasResponded: true },
    });
    const attendingGuests = await prisma.guest.count({
      where: { attending: true },
    });
    const totalAttendees = await prisma.guest.aggregate({
      _sum: { guestCount: true },
      where: { attending: true },
    });
    
    return NextResponse.json({
      totalGuests,
      respondedGuests,
      attendingGuests,
      totalAttendees: totalAttendees._sum.guestCount || 0,
      responseRate: totalGuests > 0 ? (respondedGuests / totalGuests) * 100 : 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}