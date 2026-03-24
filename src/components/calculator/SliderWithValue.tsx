'use client';

import { useState, useEffect, ReactNode } from 'react';

interface SliderWithValueProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  helpText?: string | ReactNode;
}

export default function SliderWithValue({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  helpText,
}: SliderWithValueProps) {
  const [localString, setLocalString] = useState(value.toString());

  // Sync external value to local state
  useEffect(() => {
    setLocalString(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalString(e.target.value);
  };

  const handleInputBlur = () => {
    let val = parseFloat(localString) || min;
    // Clamp between min and max
    val = Math.max(min, Math.min(max, val));
    // Snap to nearest step
    val = Math.round(val / step) * step;
    // Update parent component
    onChange(val);
  };

  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className="space-y-1">
      {/* Label, Slider, and Value in one row */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-stone-700 whitespace-nowrap min-w-[100px]">
          {label}
        </label>

        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((value - min) / (max - min)) * 100}%, #e7e5e4 ${((value - min) / (max - min)) * 100}%, #e7e5e4 100%)`,
          }}
        />

        <input
          type="number"
          value={localString}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          step={step}
          className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap min-w-[80px] text-center border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Help Text */}
      {helpText && (
        <div className="text-xs text-stone-500 ml-[100px]">
          {typeof helpText === 'string' ? <p>{helpText}</p> : helpText}
        </div>
      )}
    </div>
  );
}
