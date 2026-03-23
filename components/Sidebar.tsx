"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { LRResult } from "@/lib/lr";

interface SidebarProps {
  result: LRResult;
  onCalculate: (humidity: number, temp: number) => void;
  onReset: () => void;
  prediction: { humidity: number; temp: number; pred: number } | null;
}

function Field({
  label, value, onChange, placeholder, unit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold tracking-wider text-[#888] uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 bg-[#2a2a2a] border border-[#3e3e3e] rounded-lg px-3 pr-9 text-sm text-[#f0f0f0] font-mono outline-none focus:border-[#5b9bd5] hover:border-[#555] transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#666] pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function Sidebar({ result, onCalculate, onReset, prediction }: SidebarProps) {
  const [humidity, setHumidity]       = useState("");
  const [temperature, setTemperature] = useState("");

  function handleCalc() {
    const h = parseFloat(humidity);
    const t = parseFloat(temperature);
    if (!isNaN(h) && !isNaN(t)) onCalculate(h, t);
  }

  /* สมการ Linear Regression */
  function handleRandomPerfectPoint() {
    const rawHum = Math.random() * 40 + 60;
    const randomHum = parseFloat(rawHum.toFixed(2)); 
    
    const rawTemp = result.theta0 + (result.theta1 * randomHum);
    const exactTemp = parseFloat(rawTemp.toFixed(2)); 
    
    setHumidity(randomHum.toFixed(2));
    setTemperature(exactTemp.toFixed(2)); 
    onCalculate(randomHum, exactTemp);
  }

  return (
    <aside className="w-[290px] min-h-full bg-[#232323] border-r border-[#333] flex flex-col gap-5 p-6 shrink-0">

      {/* INPUT */}
      <section>
        <p className="text-[10px] font-bold tracking-[0.1em] text-[#888] mb-3 uppercase">Input</p>
        <div className="flex flex-col gap-3">
          <Field
            label="HUMIDITY (%)"
            value={humidity}
            onChange={setHumidity}
            placeholder="e.g. 80"
            unit="%"
          />
          <Field
            label="TEMPERATURE (°F)"
            value={temperature}
            onChange={setTemperature}
            placeholder="e.g. 75"
            unit="°F"
          />
          
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex gap-2">
              <Button
                onPress={handleCalc}
                className="flex-1 h-9 bg-[#e0e0e0] text-[#141414] font-bold text-xs tracking-widest uppercase rounded-lg"
              >
                Calculate
              </Button>
              <Button
                onPress={onReset}
                isIconOnly
                className="h-9 w-9 min-w-9 border border-[#3e3e3e] bg-[#2a2a2a] text-[#888] text-base rounded-lg"
              >
                ↺
              </Button>
            </div>
            
            {/* ปุ่มใหม่สำหรับ Random Perfect Point */}
            <Button
              onPress={handleRandomPerfectPoint}
              className="w-full h-9 bg-[#1a2620] text-[#6abf8a] border border-[#2a4035] font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-[#203028] transition-colors"
            >
              + Auto Perfect Point
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-none h-px bg-[#333]" />

      {/* MODEL PARAMETERS */}
      <section>
        <p className="text-[10px] font-bold tracking-[0.1em] text-[#888] mb-3 uppercase">Model Parameters</p>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "θ₀ · intercept", value: result.theta0.toFixed(2) },
              { label: "θ₁ · slope",     value: result.theta1.toFixed(4) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#2a2a2a] border border-[#333] rounded-lg p-3">
                <p className="text-[10px] text-[#666] mb-1">{label}</p>
                <p className="text-base font-bold text-[#f0f0f0]">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-3 relative overflow-hidden">
            <p className="text-[10px] text-[#666] mb-1">J(θ₀,θ₁) · cost function</p>
            <p className="text-base font-bold text-[#8dbfe8]">{result.cost.toFixed(4)}</p>
          </div>

          <div className="bg-[#1e2830] border border-[#2a3e50] rounded-lg p-3">
            <p className="text-[10px] text-[#5b9bd5] mb-1 uppercase tracking-wider">Hypothesis</p>
            <p className="text-xs font-bold text-[#8dbfe8] font-mono">
              h(x) = {result.theta0.toFixed(2)} + ({result.theta1.toFixed(4)})x
            </p>
          </div>
        </div>
      </section>

      {/* PREDICTION */}
      {prediction && (
        <>
          <hr className="border-none h-px bg-[#333]" />
          <section>
            <div className="bg-[#1a2620] border border-[#2a4035] rounded-lg p-4">
              <p className="text-[10px] text-[#6abf8a] uppercase tracking-wider mb-2">
                Prediction @ humidity = {prediction.humidity}%
              </p>
              <p className="text-xl font-bold text-[#6abf8a]">{prediction.pred.toFixed(2)} °F</p>
              <p className="text-[10px] text-[#6abf8a]/70 mt-1">
                actual = {prediction.temp.toFixed(2)}°F · error = {Math.abs(prediction.pred - prediction.temp).toFixed(2)}
              </p>
            </div>
          </section>
        </>
      )}

      <div className="mt-auto text-[10px] text-[#484848] leading-relaxed">
        x = humidity (%) · y = temperature (°F)
      </div>
    </aside>
  );
}