/**
 * Berlin timezone utilities for consistent timestamp handling
 * Europe/Berlin = CET (UTC+1) / CEST (UTC+2)
 */

import { fromZonedTime } from "date-fns-tz";
import { formatInTimeZone } from "date-fns-tz";

export const BERLIN_TIMEZONE = "Europe/Berlin";

/**
 * Regex to detect if a timestamp string already has timezone info (Z, +01:00, -05:00, etc.)
 */
const HAS_TIMEZONE = /[Zz]|[+-]\d{2}:?\d{2}$|[+-]\d{4}$/;

/**
 * Parses an incoming timestamp for storage.
 * - Number (Unix ms): use as-is
 * - String with timezone (Z, +01:00): parse as UTC/offset
 * - String without timezone: interpret as Berlin local time
 * - undefined/null: use current moment
 */
export function parseTimestampForStorage(input: unknown): Date {
  if (input == null || input === "") {
    return new Date();
  }
  if (typeof input === "number") {
    return new Date(input);
  }
  const str = String(input).trim();
  if (HAS_TIMEZONE.test(str)) {
    return new Date(str);
  }
  // No timezone - assume Berlin local time
  return fromZonedTime(str, BERLIN_TIMEZONE);
}

/**
 * Formats a Date for API response in Berlin timezone (ISO with offset).
 * Example: "2025-02-15T15:00:00+01:00"
 */
export function formatTimestampBerlin(date: Date): string {
  return formatInTimeZone(date, BERLIN_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}
