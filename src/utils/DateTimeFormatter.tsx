export const formatDateTimeForBrand = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};


export const formatDateTime = (
  date?: Date | string | null
): string => {
  if (!date) return '';
  // Ako je string, pretvori ga u Date
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return ''; 

  const day     = String(d.getDate()).padStart(2, '0');
  const month   = String(d.getMonth() + 1).padStart(2, '0');
  const year    = d.getFullYear();
  const hours   = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const formatDateToISO = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};