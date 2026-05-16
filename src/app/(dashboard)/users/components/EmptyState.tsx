'use client';

export default function EmptyState() {
  return (
    <div className="p-16 text-center">
      <h3 className="font-bold text-slate-700">
        No users found
      </h3>

      <p className="text-sm text-slate-400 mt-1">
        Create a new user to get started.
      </p>
    </div>
  );
}