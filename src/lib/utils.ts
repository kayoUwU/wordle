// Validate date format (YYYY-MM-DD)
export function validateDateStringFormat(dateStr: string): boolean {
  return (/^\d{4}-\d{2}-\d{2}$/.test(dateStr));
}

//YYYY-MM-DD
export function dateToDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dateStringToDate(dateStr: string): Date {
  if(!validateDateStringFormat(dateStr)){
    throw new Error("invalid DateStringFormat");
  }
  // avoid ISO String Issues new Date(dateStr), 
  // browsers will interpret this as UTC midnight, which might shift the date to the previous day depending on your local timezone.
  const [year, month, day ] = dateStr.split('-').map(Number); 
  // months are 0-indexed (January is 0, December is 11)
  const date= new Date(year, month - 1, day,0,0,0,0);
  return date;
}
