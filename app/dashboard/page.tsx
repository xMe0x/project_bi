"use client";
import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Charts from "@/components/Charts";
import DataTable from "@/components/Datatable";
import { BASE_DATA, calcLR, DataPoint } from "@/lib/lr";

export default function Home() {
  const [extraPoints, setExtraPoints] = useState<DataPoint[]>([]);
  const [prediction, setPrediction] = useState<{
    humidity: number; temp: number; pred: number;
  } | null>(null);

  const allData = useMemo(() => [...BASE_DATA, ...extraPoints], [extraPoints]);
  const result  = useMemo(() => calcLR(allData), [allData]);

  function handleCalculate(humidity: number, temp: number) {
    const newPt: DataPoint = {
      id:       allData.length + 1,
      outlook:  "new",
      temp,
      humidity,
    };
    setExtraPoints((prev) => [...prev, newPt]);
    const pred = result.theta0 + result.theta1 * humidity;
    setPrediction({ humidity, temp, pred });
  }

  function handleReset() {
    setExtraPoints([]);
    setPrediction(null);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          result={result}
          onCalculate={handleCalculate}
          onReset={handleReset}
          prediction={prediction}
        />

        <main className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 bg-[#1c1c1e]">
          <Charts data={allData} result={result} />
          <DataTable data={allData} result={result} />
        </main>
      </div>
    </div>
  );
}