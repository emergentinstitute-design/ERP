'use client';

import { useEffect, useState } from 'react';
import { User, Trash2, ShieldAlert } from 'lucide-react';

type UserType = {
  id: string;
  role: string;
  email?: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/get-users', {
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Failed to fetch users');
        return;
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="text-slate-500 text-sm font-medium">
          Branch Oversight & User List
        </p>
      </div>

      {/* Error Message */}
      {message && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {message}
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800">
            Branch Personnel
          </h2>

          <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
            {users.length} Total Users
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
            Fetching staff records...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No users found
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition-colors gap-4"
              >
                {/* LEFT */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {user.email || 'No Email'}
                    </p>

                    <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex space-x-2 w-full sm:w-auto">
                  <button
                    disabled
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-400 bg-red-50 rounded-xl border border-red-100 cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                  <button
                    disabled
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl border border-slate-200 cursor-not-allowed"
                  >
                    <ShieldAlert size={14} />
                    Change Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}