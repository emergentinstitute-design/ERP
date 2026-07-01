import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

      <p className="animate-pulse font-medium text-slate-500">
        Loading batch report...
      </p>
    </div>
  );
}