import { extraShapes } from "@/lib/extra-shapes";
import { featureShapes, landShapes, mapView, type MapShape } from "@/lib/eurasia-map";
import { outlineShapes } from "@/lib/outline-shapes";

const landAlias: Record<string, string> = {
  "land-kor": "south-korea",
  "land-sau": "saudi-arabia",
  "land-idn": "indonesia",
  "land-esp": "spain",
  "land-pol": "poland",
  "land-ukr": "ukraine",
  "land-gbr": "united-kingdom",
  "land-rou": "romania",
  "land-grc": "greece",
  "land-swe": "sweden",
  "land-tha": "thailand",
  "land-vnm": "vietnam",
  "land-mys": "malaysia",
  "land-phl": "philippines",
  "land-mmr": "myanmar",
  "land-khm": "cambodia",
  "land-lao": "laos",
  "land-prk": "north-korea",
  "land-pak": "pakistan",
  "land-bgd": "bangladesh",
  "land-npl": "nepal",
  "land-btn": "bhutan",
  "land-afg": "afghanistan",
  "land-uzb": "uzbekistan",
  "land-kgz": "kyrgyzstan",
  "land-tjk": "tajikistan",
  "land-tkm": "turkmenistan",
  "land-irq": "iraq",
  "land-are": "uae",
  "land-omn": "oman",
  "land-yem": "yemen",
  "land-nor": "norway",
  "land-fin": "finland",
  "land-dnk": "denmark",
  "land-isl": "iceland-country",
  "land-nld": "netherlands",
  "land-bel": "belgium",
  "land-prt": "portugal",
  "land-hrv": "croatia",
  "land-alb": "albania",
  "land-blr": "belarus",
  "land-mda": "moldova",
  "land-bgr": "bulgaria",
  "land-aut": "austria",
  "land-cze": "czechia",
  "land-hun": "hungary",
  "land-che": "switzerland",
  "land-svk": "slovakia",
  "land-rus": "russia",
  "land-arm": "armenia",
  "land-aze": "azerbaijan",
  "land-geo": "georgia",
  "land-brn": "brunei",
  "land-svn": "slovenia",
  "land-bih": "bosnia",
  "land-mkd": "macedonia",
  "land-srb": "serbia",
  "land-mne": "montenegro",
  "land-qat": "qatar",
  "land-kwt": "kuwait",
  "land-jor": "jordan",
  "land-lka": "sri-lanka-country",
  "land-twn": "taiwan-country",
  "land-est": "estonia",
  "land-lva": "latvia",
  "land-ltu": "lithuania",
  "land-irl": "ireland-country",
  "land-lux": "luxembourg",
};

export const regionLand: MapShape[] = landShapes.map((shape) => ({
  ...shape,
  id: landAlias[shape.id] ?? shape.id,
}));

const extraById = new Map(extraShapes.map((shape) => [shape.id, shape]));
const outlineById = new Map(outlineShapes.map((shape) => [shape.id, shape]));

function areal(shape: MapShape) {
  return !/[aA]/.test(shape.d);
}

export const regionFeatures: MapShape[] = [
  ...featureShapes.filter((shape) => areal(shape) && !extraById.has(shape.id) && !outlineById.has(shape.id)),
  ...extraShapes.filter((shape) => areal(shape) && !outlineById.has(shape.id)),
  ...outlineShapes.filter(areal),
];

const landById = new Map(regionLand.map((shape) => [shape.id, shape]));
const featureById = new Map(regionFeatures.map((shape) => [shape.id, shape]));

export function landShape(id: string) {
  return landById.get(id);
}

export function featureShape(id: string) {
  return featureById.get(id);
}

function featureRadii(shape: MapShape) {
  if (shape.rx && shape.ry) return { rx: shape.rx, ry: shape.ry };
  const match = shape.d.match(/a([\d.]+),([\d.]+)/);
  if (match) return { rx: Number(match[1]), ry: Number(match[2]) };
  return { rx: 28, ry: 18 };
}

function landBounds(d: string) {
  const re = /(-?\d+\.?\d+),(-?\d+\.?\d+)/g;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const match of d.matchAll(re)) {
    const x = Number(match[1]);
    const y = Number(match[2]);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

export function frameFor(ids: readonly string[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const id of ids) {
    const land = landById.get(id);
    if (land) {
      const bounds = landBounds(land.d);
      minX = Math.min(minX, bounds.minX);
      minY = Math.min(minY, bounds.minY);
      maxX = Math.max(maxX, bounds.maxX);
      maxY = Math.max(maxY, bounds.maxY);
      continue;
    }
    const feature = featureById.get(id);
    if (!feature) continue;
    const arc = /[aA]/.test(feature.d);
    if (!arc) {
      const bounds = landBounds(feature.d);
      minX = Math.min(minX, bounds.minX);
      minY = Math.min(minY, bounds.minY);
      maxX = Math.max(maxX, bounds.maxX);
      maxY = Math.max(maxY, bounds.maxY);
      continue;
    }
    const radii = featureRadii(feature);
    minX = Math.min(minX, feature.cx - radii.rx);
    minY = Math.min(minY, feature.cy - radii.ry);
    maxX = Math.max(maxX, feature.cx + radii.rx);
    maxY = Math.max(maxY, feature.cy + radii.ry);
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, width: mapView.width, height: mapView.height };
  const pad = 16;
  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  const width = Math.min(mapView.width, maxX + pad) - x;
  const height = Math.min(mapView.height, maxY + pad) - y;
  return { x, y, width: Math.max(width, 120), height: Math.max(height, 80) };
}

export { mapView };
