/**
 * Convert ISO/Date value from backend to display format:
 * dd MMM yyyy, HH:mm:ss
 *
 * Example:
 * 2026-09-05T21:36:00.000Z
 * -> 06 Sep 2026, 04:36:00
 *
 * Output follows the user's/browser local timezone.
 */
export const formatDateTime = (
  value: string | Date | null | undefined,
): string => {
  if (!value) return '-';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const pad = (number: number) => String(number).padStart(2, '0');

  return `${pad(date.getDate())} ${
    months[date.getMonth()]
  } ${date.getFullYear()}, ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};

/**
 * Convert Date/local datetime to UTC format for backend:
 * yyyy-MM-dd HH:mm:ss
 *
 * Example:
 * Local Date -> 2026-09-05 21:36:00
 * UTC         -> 2026-09-05 14:36:00
 */
export const toUTCDateTime = (
  value: Date | string | null | undefined,
): string => {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const pad = (number: number) => String(number).padStart(2, '0');

  return `${date.getUTCFullYear()}-${pad(
    date.getUTCMonth() + 1,
  )}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(
    date.getUTCMinutes(),
  )}:${pad(date.getUTCSeconds())}`;
};