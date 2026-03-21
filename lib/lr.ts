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
  iterations: number;
}

export interface GDConfig {
  alpha: number;       // learning rate
  iterations: number;  // จำนวนรอบ
}

export const DEFAULT_GD_CONFIG: GDConfig = {
  alpha: 0.01,
  iterations: 10000,
};

export function calcLR(pts: DataPoint[], config: GDConfig = DEFAULT_GD_CONFIG): LRResult {
  const n = pts.length;
  const { alpha, iterations } = config;

  // --- Feature Normalization (ทำให้ GD converge เร็วและเสถียร) ---
  const hum  = pts.map((p) => p.humidity);
  const tmp  = pts.map((p) => p.temp);
  const humMean = hum.reduce((s, v) => s + v, 0) / n;
  const tmpMean = tmp.reduce((s, v) => s + v, 0) / n;
  const humStd  = Math.sqrt(hum.reduce((s, v) => s + (v - humMean) ** 2, 0) / n);
  const tmpStd  = Math.sqrt(tmp.reduce((s, v) => s + (v - tmpMean) ** 2, 0) / n);

  // normalized data
  const norm = pts.map((p) => ({
    x: (p.humidity - humMean) / humStd,
    y: (p.temp     - tmpMean) / tmpStd,
  }));

  // --- Gradient Descent (ตามสไลด์อาจารย์ หน้า 35-41) ---
  // เริ่มต้น θ = 0 (ค่าใดก็ได้)
  let t0 = 0;
  let t1 = 0;

  for (let iter = 0; iter < iterations; iter++) {
    // คำนวณ gradient ของ J เทียบกับ θ₀ และ θ₁
    // j=0: (1/m) × Σ(h(x⁽ⁱ⁾) − y⁽ⁱ⁾)
    // j=1: (1/m) × Σ(h(x⁽ⁱ⁾) − y⁽ⁱ⁾) × x⁽ⁱ⁾
    const d0 = norm.reduce((s, p) => s + (t0 + t1 * p.x - p.y), 0) / n;
    const d1 = norm.reduce((s, p) => s + (t0 + t1 * p.x - p.y) * p.x, 0) / n;

    // Simultaneous update (อัปเดตพร้อมกัน ตามสไลด์)
    t0 = t0 - alpha * d0;
    t1 = t1 - alpha * d1;
  }

  // --- แปลงกลับ original scale ---
  const theta1 = t1 * (tmpStd / humStd);
  const theta0 = tmpMean - theta1 * humMean;

  // --- Cost Function J ใน original scale ---
  const cost = pts.reduce(
    (s, p) => s + Math.pow(theta0 + theta1 * p.humidity - p.temp, 2),
    0
  ) / (2 * n);

  return { theta0, theta1, cost, iterations };
}

export const OUTLOOK_COLOR: Record<string, string> = {
  sunny:    "#d4a843",
  overcast: "#777777",
  rainy:    "#5b9bd5",
  new:      "#6abf8a",
};