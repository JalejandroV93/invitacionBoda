import { parse } from 'csv-parse';
import { Guest } from '@prisma/client';

export interface CsvGuestData {
  name: string;
  code?: string;
}

export function parseCsvData(csvContent: string): Promise<CsvGuestData[]> {
  return new Promise((resolve, reject) => {
    const records: CsvGuestData[] = [];
    
    parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
    .on('data', (data) => {
      if (data.name) {
        records.push({
          name: data.name,
          code: data.code || undefined,
        });
      }
    })
    .on('error', reject)
    .on('end', () => resolve(records));
  });
}

export function generateCsvFromGuests(guests: Guest[]): string {
  const headers = ['name', 'code', 'hasResponded', 'attending', 'guestCount', 'dietaryRestrictions', 'comments', 'createdAt', 'respondedAt'];
  
  const csvContent = [
    headers.join(','),
    ...guests.map(guest => [
      `"${guest.name}"`,
      guest.code,
      guest.hasResponded,
      guest.attending,
      guest.guestCount,
      `"${guest.dietaryRestrictions || ''}"`,
      `"${guest.comments || ''}"`,
      guest.createdAt.toISOString(),
      guest.respondedAt?.toISOString() || '',
    ].join(','))
  ].join('\n');
  
  return csvContent;
}