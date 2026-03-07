/**
 * Fetch upcoming competitions from the World Cube Association API.
 * Filters to Northern California only and excludes Yuba City.
 * @see https://www.worldcubeassociation.org/api/
 */

export interface WCACompetition {
  id: string;
  name: string;
  short_name: string;
  start_date: string;
  end_date: string;
  url: string;
  city: string;
  country_iso2: string;
  date_range?: string;
}

const WCA_API = "https://www.worldcubeassociation.org/api/v0/competitions";
const WCA_COMPETITION_URL = "https://www.worldcubeassociation.org/competitions";

/** Curated competitions to always include (added on top of API results). */
const CURATED_COMPETITIONS: WCACompetition[] = [
  {
    id: "BerkeleySpring2026",
    name: "Berkeley Spring 2026",
    short_name: "Berkeley Spring 2026",
    start_date: "2026-03-01",
    end_date: "2026-03-02",
    url: `${WCA_COMPETITION_URL}/BerkeleySpring2026`,
    city: "Berkeley",
    country_iso2: "US",
    date_range: "Mar 1 – 2, 2026",
  },
  {
    id: "BelmontSpring2026",
    name: "Belmont Spring 2026",
    short_name: "Belmont Spring 2026",
    start_date: "2026-03-01",
    end_date: "2026-03-02",
    url: `${WCA_COMPETITION_URL}/BelmontSpring2026`,
    city: "Belmont",
    country_iso2: "US",
    date_range: "Mar 1 – 2, 2026",
  },
  {
    id: "WesternChampionship2026",
    name: "Western Championship 2026",
    short_name: "Western Championship 2026",
    start_date: "2026-05-23",
    end_date: "2026-05-25",
    url: `${WCA_COMPETITION_URL}/WesternChampionship2026`,
    city: "Riverside",
    country_iso2: "US",
    date_range: "May 23 – 25, 2026",
  },
  {
    id: "NAC2026",
    name: "NAC 2026",
    short_name: "NAC 2026",
    start_date: "2026-07-02",
    end_date: "2026-07-05",
    url: `${WCA_COMPETITION_URL}/NAC2026`,
    city: "Raleigh",
    country_iso2: "US",
    date_range: "Jul 2 – 5, 2026",
  },
];

/** Competition names (or short_name) to exclude from API results. */
const EXCLUDED_COMPETITION_NAMES = ["SCU III: FMC Triple-Scoop 2026"];

/** Northern California approx bounds: lat 36–42, lon -125 to -119 */
const NORCAL_LAT_MIN = 36;
const NORCAL_LAT_MAX = 42;
const NORCAL_LON_MIN = -125;
const NORCAL_LON_MAX = -119;

/** Known Northern California cities (fallback when API omits lat/lon) */
const NORCAL_CITIES = new Set([
  "san francisco", "oakland", "berkeley", "san jose", "sacramento",
  "davis", "stockton", "modesto", "fresno", "santa rosa", "napa",
  "redding", "chico", "santa cruz", "palo alto", "sunnyvale",
  "mountain view", "cupertino", "fremont", "hayward", "concord",
  "fairfield", "vallejo", "richmond", "san rafael", "livermore",
]);

function isNorthernCalifornia(
  city: string,
  lat: number | null,
  lon: number | null
): boolean {
  const cityLower = city.toLowerCase();
  if (cityLower.includes("yuba city")) return false;
  if (lat != null && lon != null) {
    return (
      lat >= NORCAL_LAT_MIN &&
      lat <= NORCAL_LAT_MAX &&
      lon >= NORCAL_LON_MIN &&
      lon <= NORCAL_LON_MAX
    );
  }
  return NORCAL_CITIES.has(cityLower);
}

export async function getUpcomingCompetitions(
  limit = 20
): Promise<WCACompetition[]> {
  const start = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    const res = await fetch(
      `${WCA_API}?start=${start}&country_iso2=US&sort=start_date`,
      { next: { revalidate: 3600 } } // cache 1 hour
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      id: string;
      name: string;
      short_name: string;
      start_date: string;
      end_date: string;
      city: string;
      country_iso2: string;
      date_range?: string;
      latitude_degrees?: number;
      longitude_degrees?: number;
    }>;
    const excludedSet = new Set(
      EXCLUDED_COMPETITION_NAMES.map((n) => n.toLowerCase())
    );
    const fromApi = data
      .filter((c) =>
        isNorthernCalifornia(
          c.city,
          c.latitude_degrees ?? null,
          c.longitude_degrees ?? null
        )
      )
      .filter(
        (c) =>
          !excludedSet.has(c.name.toLowerCase()) &&
          !excludedSet.has(c.short_name.toLowerCase())
      )
      .slice(0, limit)
      .map((c) => ({
        id: c.id,
        name: c.name,
        short_name: c.short_name,
        start_date: c.start_date,
        end_date: c.end_date,
        url: `${WCA_COMPETITION_URL}/${c.id}`,
        city: c.city,
        country_iso2: c.country_iso2,
        date_range: c.date_range,
      }));

    const curatedIds = new Set(CURATED_COMPETITIONS.map((c) => c.id));
    const fromApiWithoutCurated = fromApi.filter((c) => !curatedIds.has(c.id));
    const merged = [...CURATED_COMPETITIONS, ...fromApiWithoutCurated];
    merged.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    return merged.slice(0, limit + CURATED_COMPETITIONS.length);
  } catch {
    return [];
  }
}
