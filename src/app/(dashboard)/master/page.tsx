'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string;
  role: string;
  email?: string;
};

export default function MasterPage() {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [role, setRole] = useState<'admin' | 'teacher'>('admin');

  const [message, setMessage] = useState('');

  const [users, setUsers] = useState<User[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(true);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Auto-clear messages
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const res = await fetch('/api/get-users', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();

      setUsers(data.users || []);
    } catch (error) {
      console.error('FETCH USERS ERROR:', error);

      setMessage('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create User
  const handleCreateUser = async () => {
    if (!email || !password) {
      setMessage('Please fill all fields');

      return;
    }

    try {
      setProcessingId('create');

      const res = await fetch('/api/create-user', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      if (!res.ok) {
        throw new Error('Create user failed');
      }

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);

        return;
      }

      setMessage('User created successfully ✅');

      setEmail('');

      setPassword('');

      await fetchUsers();
    } catch (error) {
      console.error('CREATE USER ERROR:', error);

      setMessage('Failed to create user');
    } finally {
      setProcessingId(null);
    }
  };

  // Delete User
  const handleDelete = async (userId: string) => {
    const confirmDelete = confirm('Delete this user?');

    if (!confirmDelete) return;

    try {
      setProcessingId(userId);

      const res = await fetch('/api/delete-user', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          userId,
        }),
      });

      if (!res.ok) {
        throw new Error('Delete failed');
      }

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);

        return;
      }

      setMessage('User deleted 🧨');

      await fetchUsers();
    } catch (error) {
      console.error('DELETE ERROR:', error);

      setMessage('Failed to delete user');
    } finally {
      setProcessingId(null);
    }
  };

  // Change Role
  const handleRoleChange = async (
    userId: string,
    newRole: 'admin' | 'teacher'
  ) => {
    try {
      setProcessingId(userId);

      const res = await fetch('/api/update-role', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      if (!res.ok) {
        throw new Error('Role update failed');
      }

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);

        return;
      }

      setMessage('Role updated 🔄');

      await fetchUsers();
    } catch (error) {
      console.error('ROLE UPDATE ERROR:', error);

      setMessage('Failed to update role');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Master Control
        </h1>

        <p className="text-gray-500">
          Manage organizational access and roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create User */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">
            Create New Account
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Email Address"
              className="w-full p-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Secure Password"
              type="password"
              className="w-full p-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'admin' | 'teacher')
              }
            >
              <option value="admin">
                Admin (Branch Manager)
              </option>

              <option value="teacher">
                Teacher (Faculty)
              </option>
            </select>

            <button
              onClick={handleCreateUser}
              disabled={processingId === 'create'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-xl disabled:opacity-50 transition"
            >
              {processingId === 'create'
                ? 'Processing...'
                : 'Create User'}
            </button>

            {message && (
              <p className="text-center text-sm font-medium text-blue-600">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">
              Active Staff
            </h2>
          </div>

          {loadingUsers ? (
            <div className="p-12 text-center text-gray-400">
              Loading users...
            </div>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold uppercase">
                      {user.email?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {user.email || 'N/A'}
                      </p>

                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          user.role === 'master'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {user.role !== 'master' && (
                      <>
                        <select
                          value={user.role}
                          disabled={processingId === user.id}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as 'admin' | 'teacher'
                            )
                          }
                          className="bg-transparent text-sm border-none focus:ring-0 text-gray-500 cursor-pointer"
                        >
                          <option value="admin">
                            Admin
                          </option>

                          <option value="teacher">
                            Teacher
                          </option>
                        </select>

                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={processingId === user.id}
                          className="p-2 text-gray-400 hover:text-red-500 transition"
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}