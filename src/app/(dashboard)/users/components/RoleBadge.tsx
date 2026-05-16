'use client';

type Props = {
  role: string;

  isPrimaryAdmin?: boolean;
};

export default function RoleBadge({
  role,
  isPrimaryAdmin,
}: Props) {
  if (role === 'master') {
    return (
      <span className="text-[11px] uppercase tracking-wider font-bold text-purple-600">
        Master
      </span>
    );
  }

  if (
    role === 'admin' &&
    isPrimaryAdmin
  ) {
    return (
      <span className="text-[11px] uppercase tracking-wider font-bold text-amber-600">
        Primary Admin
      </span>
    );
  }

  return (
    <span
      className={`text-[11px] uppercase tracking-wider font-bold ${
        role === 'admin'
          ? 'text-blue-600'
          : 'text-green-600'
      }`}
    >
      {role}
    </span>
  );
}