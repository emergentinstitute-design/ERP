import { Filter, Search } from "lucide-react";

interface StudentsFiltersProps {
  searchTerm: string;
  selectedBatch: string;
  batches: string[];
  onSearchChange: (value: string) => void;
  onBatchChange: (value: string) => void;
}

export default function StudentsFilters({
  searchTerm,
  selectedBatch,
  batches,
  onSearchChange,
  onBatchChange,
}: StudentsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or contact parameter..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      <div className="w-full md:w-64 relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <select
          value={selectedBatch}
          onChange={(e) => onBatchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer shadow-sm text-slate-700"
        >
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch === "All" ? "All Batches" : `Batch: ${batch}`}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
}