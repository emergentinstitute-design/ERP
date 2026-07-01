import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">
        Accessing student ledger...
      </p>
    </div>
  );
}