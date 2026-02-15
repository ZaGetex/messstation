/**
 * Coordinate formatting utilities
 * Converts decimal degrees to DMS (Degrees, Minutes, Seconds) for display
 */

/**
 * Convert decimal degrees to degrees, minutes, seconds
 * @param decimal - angle in decimal degrees
 * @param isLatitude - true for latitude (N/S), false for longitude (E/W)
 * @param decimals - number of decimal places for seconds (default 2)
 * @returns DMS string e.g. "52° 31' 12.03'' N" or "13° 24' 56.78'' E"
 */
function decimalToDMSPart(
  decimal: number,
  isLatitude: boolean,
  decimals: number = 2
): string {
  const direction = isLatitude
    ? decimal >= 0
      ? "N"
      : "S"
    : decimal >= 0
      ? "E"
      : "W";
  const abs = Math.abs(decimal);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = (abs - d - m / 60) * 3600;
  const sStr = s.toFixed(decimals);
  return `${d}° ${m}' ${sStr}'' ${direction}`;
}

/**
 * Format latitude and longitude in decimal degrees as DMS coordinates string
 * @param lat - latitude in decimal degrees
 * @param lon - longitude in decimal degrees
 * @param decimals - decimal places for seconds (default 2)
 * @returns e.g. "52° 31' 12.03'' N, 13° 24' 56.78'' E"
 */
export function decimalToDMS(
  lat: number,
  lon: number,
  decimals: number = 2
): string {
  const latStr = decimalToDMSPart(lat, true, decimals);
  const lonStr = decimalToDMSPart(lon, false, decimals);
  return `${latStr}, ${lonStr}`;
}
