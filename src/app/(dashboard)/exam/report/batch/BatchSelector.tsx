"use client";

import { Filter } from "lucide-react";

interface BatchSelectorProps {
  batches: string[];
  selectedBatch: string;
  onBatchChange: (batch: string) => void;
}

export function BatchSelector({
  batches,
  selectedBatch,
  onBatchChange,
}: BatchSelectorProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row">
      <div className="relative w-full md:w-64">
        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <select
          value={selectedBatch}
          onChange={(event) => onBatchChange(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        >
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch === "All" ? "All Batches" : `Batch: ${batch}`}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400">
          ▼
        </div>
      </div>

      {selectedBatch !== "All" && (
        <div className="flex items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
          Showing report for Batch: {selectedBatch}
        </div>
      )}
    </div>
  );
}