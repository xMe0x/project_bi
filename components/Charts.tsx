"use client";
import {
  ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { DataPoint, LRResult, OUTLOOK_COLOR } from "@/lib/lr";

interface ChartsProps {
  data: DataPoint[];
  result: LRResult;
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = OUTLOOK_COLOR[payload.outlook] ?? "#5b9bd5";
  return (
    <circle cx={cx} cy={cy} r={5} fill={color} stroke="#1c1c1e" strokeWidth={2} />
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as DataPoint;
  return (
    <div className="bg-[#2a2a2a] border border-[#3e3e3e] rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <p className="font-bold text-[#f0f0f0] mb-1">#{d?.id} {d?.outlook}</p>
      <p className="text-[#888]">Humidity: <span className="text-[#f0f0f0]">{d?.humidity}%</span></p>
      <p className="text-[#888]">Temp: <span className="text-[#f0f0f0]">{d?.temp}°F</span></p>
    </div>
  );
};

const TICK_STYLE = { fontSize: 10, fill: "#484848", fontFamily: "IBM Plex Mono, monospace" };
const GRID_STYLE = { stroke: "#2a2a2a" };

function ChartCard({
  title,
  children,
  legend,
}: {
  title: string;
  children: React.ReactNode;
  legend: React.ReactNode;
}) {
  return (
    <div className="bg-[#232323] border border-[#333] rounded-xl p-5 flex flex-col gap-3">
      <p className="text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase">{title}</p>
      <div className="h-[220px] w-full min-w-0">{children}</div>
      <div className="flex flex-wrap gap-3">{legend}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] text-[#888]">
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
      {label}
    </span>
  );
}

function LegendLine({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] text-[#888]">
      <span className="w-4 h-0.5 inline-block rounded" style={{ background: color }} />
      {label}
    </span>
  );
}

export default function Charts({ data, result }: ChartsProps) {
  const { theta0, theta1 } = result;

  const linePoints = [
    { humidity: 60, temp: parseFloat((theta0 + theta1 * 60).toFixed(2)), outlook: "line" as const },
    { humidity: 100, temp: parseFloat((theta0 + theta1 * 100).toFixed(2)), outlook: "line" as const },
  ];

  const axisProps = {
    tick: TICK_STYLE,
    axisLine: { stroke: "#333" },
    tickLine: { stroke: "#333" },
  };

  return (
    <div className="grid grid-cols-2 gap-5">
      {/* Scatter plot */}
      <ChartCard
        title="Scatter Plot"
        legend={
          <>
            {(["sunny", "overcast", "rainy"] as const).map((o) => (
              <LegendDot key={o} color={OUTLOOK_COLOR[o]} label={o} />
            ))}
            <LegendLine color="#c96a6a" label="regression" />
          </>
        }
      >
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 4, right: 8, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" {...GRID_STYLE} />
            <XAxis dataKey="humidity" type="number" domain={[60, 100]} name="Humidity"
              label={{ value: "Humidity (%)", position: "insideBottom", offset: -12, fontSize: 10, fill: "#484848" }}
              {...axisProps} />
            <YAxis dataKey="temp" type="number" domain={[55, 100]}
              label={{ value: "Temp (°F)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#484848" }}
              {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            {/* Data points */}
            <Scatter data={data} shape={<CustomDot />} />
            {/* Regression line */}
            <Scatter
              data={linePoints}
              line={{ stroke: "#c96a6a", strokeWidth: 2 }}
              shape={() => null}
              
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Linear regression line */}
      <ChartCard
        title="Linear Regression Line"
        legend={
          <>
            {(["sunny", "overcast", "rainy"] as const).map((o) => (
              <LegendDot key={o} color={OUTLOOK_COLOR[o]} label={o} />
            ))}
            <LegendLine color="#5b9bd5" label={`h(x) = ${theta0.toFixed(1)} + (${theta1.toFixed(3)})x`} />
          </>
        }
      >
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 4, right: 8, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" {...GRID_STYLE} />
            <XAxis dataKey="humidity" type="number" domain={[60, 100]} name="Humidity"
              label={{ value: "Humidity (%)", position: "insideBottom", offset: -12, fontSize: 10, fill: "#484848" }}
              {...axisProps} />
            <YAxis dataKey="temp" type="number" domain={[55, 100]}
              label={{ value: "Temp (°F)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#484848" }}
              {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} shape={<CustomDot />} />
            <Scatter
              data={linePoints}
              line={{ stroke: "#5b9bd5", strokeWidth: 2 }}
              shape={() => null}

            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}