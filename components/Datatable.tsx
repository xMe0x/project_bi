"use client";
import { DataPoint, LRResult, OUTLOOK_COLOR } from "@/lib/lr";

interface DataTableProps {
  data: DataPoint[];
  result: LRResult;
}

const HEADERS = ["#", "OUTLOOK", "HUMIDITY", "TEMP (ACTUAL)", "TEMP (PREDICTED)", "ERROR"];

export default function DataTable({ data, result }: DataTableProps) {
  const { theta0, theta1 } = result;

  const rows = data.map((d) => {
    const pred = theta0 + theta1 * d.humidity;
    const err  = pred - d.temp;
    return { ...d, pred, err };
  });

  return (
    <div className="bg-[#232323] border border-[#333] rounded-xl overflow-hidden">
      <div className="overflow-auto max-h-[240px]">
        <table className="min-w-full font-mono text-xs border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#2a2a2a] border-b border-[#333]">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-[10px] font-bold tracking-[0.08em] text-[#888] uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors ${
                  row.outlook === "new" ? "bg-[#1e2830]" : ""
                }`}
              >
                <td className="px-4 py-2 text-[#888] w-8">{row.id}</td>
                <td className="px-4 py-2">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={{
                      color:           OUTLOOK_COLOR[row.outlook],
                      backgroundColor: OUTLOOK_COLOR[row.outlook] + "22",
                      borderColor:     OUTLOOK_COLOR[row.outlook] + "55",
                    }}
                  >
                    {row.outlook}
                  </span>
                </td>
                <td className="px-4 py-2 text-[#f0f0f0]">{row.humidity}%</td>
                <td className="px-4 py-2 text-[#f0f0f0]">{row.temp}°F</td>
                <td className="px-4 py-2 font-bold text-[#8dbfe8]">{row.pred.toFixed(2)}°F</td>
                <td className="px-4 py-2">
                  <span
                    className="font-bold"
                    style={{
                      color: Math.abs(row.err) > 5 ? "#c96a6a" : "#6abf8a",
                    }}
                  >
                    {row.err > 0 ? "+" : ""}{row.err.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 text-[10px] text-[#484848]">
        {data.length} rows total · sorted by id
      </div>
    </div>
  );
}