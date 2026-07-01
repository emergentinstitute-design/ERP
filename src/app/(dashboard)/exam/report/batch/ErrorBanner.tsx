import { AlertCircle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}