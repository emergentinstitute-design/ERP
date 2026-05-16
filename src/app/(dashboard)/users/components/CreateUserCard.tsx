'use client';

import { UserPlus } from 'lucide-react';

type Props = {
  email: string;

  password: string;

  role: 'admin' | 'teacher';

  processing: boolean;

  setEmail: (
    value: string
  ) => void;

  setPassword: (
    value: string
  ) => void;

  setRole: (
    value: 'admin' | 'teacher'
  ) => void;

  onCreate: () => void;
};

export default function CreateUserCard({
  email,
  password,
  role,
  processing,
  setEmail,
  setPassword,
  setRole,
  onCreate,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <UserPlus size={22} />
        </div>

        <div>
          <h2 className="font-bold text-slate-900">
            Create User
          </h2>

          <p className="text-xs text-slate-500">
            Add admin or teacher accounts
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition"
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value as
                | 'admin'
                | 'teacher'
            )
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition"
        >
          <option value="teacher">
            Teacher
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button
          onClick={onCreate}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition"
        >
          {processing
            ? 'Creating User...'
            : 'Create User'}
        </button>
      </div>
    </div>
  );
}