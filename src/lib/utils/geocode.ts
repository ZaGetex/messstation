/**
 * Geocoding utilities (Nominatim)
 */

const NOMINATIM_HEADERS = {
  "User-Agent": "messstation-web/0.1 (nextjs)",
};

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  country?: string;
  [key: string]: string | undefined;
};

/**
 * Reverse-geocode coordinates and return the overarching place (e.g. city name like "Hamburg").
 * Prefers city/town/village over full address.
 * @param lat - latitude in decimal degrees
 * @param lng - longitude in decimal degrees
 * @returns Short place name (Ort) or null on failure
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
  const res = await fetch(url, { headers: NOMINATIM_HEADERS });
  if (!res.ok) return null;
  const json: { display_name?: string; address?: NominatimAddress } =
    await res.json();
  const addr = json.address;
  if (addr) {
    const short =
      addr.city ??
      addr.town ??
      addr.village ??
      addr.municipality ??
      addr.state ??
      addr.country;
    if (short) return short;
  }
  return json.display_name ?? null;
}
