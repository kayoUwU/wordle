//YYYY-MM-DD
export function dateToDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dateStringToDate(dateStr: string): Date {
  return new Date(dateStr);
}

// Validate date format (YYYY-MM-DD)
export function validateDateStringFormat(dateStr: string): boolean {
  return (/^\d{4}-\d{2}-\d{2}$/.test(dateStr));
}