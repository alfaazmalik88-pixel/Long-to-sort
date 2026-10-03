/**
 * Exact Minute & Second Precision Formatter
 * Formats fractional minutes into exact human-readable representation:
 * - 5 minutes -> "5m"
 * - 4.5 minutes -> "4m 30s"
 * - 0.75 minutes (45s) -> "45s"
 * - 3.2 minutes -> "3m 12s"
 * - 0 minutes -> "0s"
 * 
 * Guarantees zero second loss or rounding inflation.
 */
export const formatMinutesAndSeconds = (totalMinutes: number | undefined | null): string => {
  if (totalMinutes === undefined || totalMinutes === null) return '0s';
  if (totalMinutes <= 0) return '0s';
  const totalSeconds = Math.round(totalMinutes * 60);
  if (totalSeconds <= 0) return '0s';

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};
