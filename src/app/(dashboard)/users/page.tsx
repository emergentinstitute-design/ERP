'use client';

import { useEffect, useState } from 'react';

import CreateUserCard from '@/app/(dashboard)/users/components/CreateUserCard';

import UsersList from '@/app/(dashboard)/users/components/UsersList';

type UserType = {
  id: string;

  role: string;

  email?: string;

  is_primary_admin?: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [role, setRole] = useState<'admin' | 'teacher'>(
    'teacher'
  );

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [currentUserRole, setCurrentUserRole] =
    useState('');

  /*
  =====================================
  FETCH USERS
  =====================================
  */

/*
=====================================
FETCH USERS
=====================================
*/

const fetchUsers = async () => {
  try {
    setLoading(true);

    const res = await fetch('/api/get-users', {
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);

      return;
    }

    // SAVE CURRENT USER ROLE
    setCurrentUserRole(
      data.currentUserRole
    );

    let filteredUsers =
      data.users || [];

    /*
    =====================================
    ADMIN SHOULD NOT SEE MASTER ACCOUNT
    =====================================
    */

    if (
      data.currentUserRole ===
      'admin'
    ) {
      filteredUsers =
        filteredUsers.filter(
          (user: UserType) =>
            user.role !== 'master'
        );
    }

    setUsers(filteredUsers);
  } catch (error) {
    console.error(error);

    setMessage('Something went wrong');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  /*
  =====================================
  CREATE USER
  =====================================
  */

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
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);

        return;
      }

      setMessage(
        'User created successfully ✅'
      );

      setEmail('');

      setPassword('');

      setRole('teacher');

      fetchUsers();
    } catch (error) {
      console.error(error);

      setMessage('Something went wrong');
    } finally {
      setProcessingId(null);
    }
  };

  /*
  =====================================
  DELETE USER
  =====================================
  */

  const handleDelete = async (
    userId: string
  ) => {
    const confirmed = confirm(
      'Delete this user?'
    );

    if (!confirmed) return;

    try {
      setProcessingId(userId);

      const res = await fetch('/api/delete-user', {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);

        return;
      }

      setMessage('User deleted 🗑️');

      fetchUsers();
    } catch (error) {
      console.error(error);

      setMessage('Something went wrong');
    } finally {
      setProcessingId(null);
    }
  };

  /*
  =====================================
  CHANGE ROLE
  =====================================
  */

  const handleRoleChange = async (
    userId: string,
    role: 'admin' | 'teacher'
  ) => {
    try {
      setProcessingId(userId);

      const res = await fetch('/api/update-role', {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          userId,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);

        return;
      }

      setMessage('Role updated 🔄');

      fetchUsers();
    } catch (error) {
      console.error(error);

      setMessage('Something went wrong');
    } finally {
      setProcessingId(null);
    }
  };

  /*
  =====================================
  SET PRIMARY ADMIN
  =====================================
  */

  const handleSetPrimaryAdmin =
    async (userId: string) => {
      try {
        setProcessingId(userId);

        const res = await fetch(
          '/api/set-primary-admin',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              userId,
              makePrimary: true,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error);

          return;
        }

        setMessage(
          'Primary admin updated ⭐'
        );

        fetchUsers();
      } catch (error) {
        console.error(error);

        setMessage(
          'Something went wrong'
        );
      } finally {
        setProcessingId(null);
      }
    };

  /*
  =====================================
  REMOVE PRIMARY ADMIN
  =====================================
  */

  const handleRemovePrimaryAdmin =
    async (userId: string) => {
      try {
        setProcessingId(userId);

        const res = await fetch(
          '/api/set-primary-admin',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              userId,
              makePrimary: false,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error);

          return;
        }

        setMessage(
          'Primary admin removed'
        );

        fetchUsers();
      } catch (error) {
        console.error(error);

        setMessage(
          'Something went wrong'
        );
      } finally {
        setProcessingId(null);
      }
    };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          User Management
        </h1>

        <p className="text-slate-500 mt-1">
          Create and manage admins and
          teachers.
        </p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <CreateUserCard
          email={email}
          password={password}
          role={role}
          processing={
            processingId === 'create'
          }
          setEmail={setEmail}
          setPassword={setPassword}
          setRole={setRole}
          onCreate={handleCreateUser}
        />

        <UsersList
          users={users}
          loading={loading}
          processingId={processingId}
          currentUserRole={
            currentUserRole
          }
          onDelete={handleDelete}
          onRoleChange={
            handleRoleChange
          }
          onSetPrimaryAdmin={
            handleSetPrimaryAdmin
          }
          onRemovePrimaryAdmin={
            handleRemovePrimaryAdmin
          }
        />
      </div>
    </div>
  );
}