export interface DataPoint {
  id: number;
  outlook: "sunny" | "overcast" | "rainy" | "new";
  temp: number;
  humidity: number;
}

export const BASE_DATA: DataPoint[] = [
  { id: 1,  outlook: "sunny",    temp: 85, humidity: 85 },
  { id: 2,  outlook: "sunny",    temp: 80, humidity: 90 },
  { id: 3,  outlook: "overcast", temp: 83, humidity: 86 },
  { id: 4,  outlook: "rainy",    temp: 70, humidity: 96 },
  { id: 5,  outlook: "rainy",    temp: 68, humidity: 80 },
  { id: 6,  outlook: "rainy",    temp: 65, humidity: 70 },
  { id: 7,  outlook: "overcast", temp: 64, humidity: 65 },
  { id: 8,  outlook: "sunny",    temp: 72, humidity: 95 },
  { id: 9,  outlook: "sunny",    temp: 69, humidity: 70 },
  { id: 10, outlook: "rainy",    temp: 75, humidity: 80 },
  { id: 11, outlook: "sunny",    temp: 75, humidity: 70 },
  { id: 12, outlook: "overcast", temp: 72, humidity: 90 },
  { id: 13, outlook: "overcast", temp: 81, humidity: 75 },
  { id: 14, outlook: "rainy",    temp: 71, humidity: 91 },
];

export interface LRResult {
  theta0: number;
  theta1: number;
  cost: number;
}

export function calcLR(pts: DataPoint[]): LRResult {
  const n = pts.length;
  const sx  = pts.reduce((s, p) => s + p.humidity, 0);
  const sy  = pts.reduce((s, p) => s + p.temp, 0);
  const sxy = pts.reduce((s, p) => s + p.humidity * p.temp, 0);
  const sx2 = pts.reduce((s, p) => s + p.humidity * p.humidity, 0);
  const t1  = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
  const t0  = (sy - t1 * sx) / n;
  const cost = pts.reduce((s, p) => s + Math.pow(t0 + t1 * p.humidity - p.temp, 2), 0) / (2 * n);
  return { theta0: t0, theta1: t1, cost };
}

export const OUTLOOK_COLOR: Record<string, string> = {
  sunny:    "#d4a843",
  overcast: "#777777",
  rainy:    "#5b9bd5",
  new:      "#6abf8a",
};