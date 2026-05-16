'use client';

import UserRow from './UserRow';

import EmptyState from './EmptyState';

type UserType = {
  id: string;

  role: string;

  email?: string;

  is_primary_admin?: boolean;
};

type Props = {
  users: UserType[];

  loading: boolean;

  processingId: string | null;

  currentUserRole: string;

  onDelete: (
    userId: string
  ) => void;

  onRoleChange: (
    userId: string,
    role: 'admin' | 'teacher'
  ) => void;

  onSetPrimaryAdmin: (
    userId: string
  ) => void;

  onRemovePrimaryAdmin: (
    userId: string
  ) => void;
};

export default function UsersList({
  users,
  loading,
 processingId,
  currentUserRole,
  onDelete,
  onRoleChange,
  onSetPrimaryAdmin,
  onRemovePrimaryAdmin,
}: Props) {

  // HIDE MASTER ACCOUNT FOR ADMINS
  const filteredUsers =
    currentUserRole === 'admin'
      ? users.filter(
          (user) =>
            user.role !== 'master'
        )
      : users;

  return (
    <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">
            Active Users
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Total {filteredUsers.length} users
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-medium">
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              processingId={processingId}
              currentUserRole={
                currentUserRole
              }
              onDelete={onDelete}
              onRoleChange={
                onRoleChange
              }
              onSetPrimaryAdmin={
                onSetPrimaryAdmin
              }
              onRemovePrimaryAdmin={
                onRemovePrimaryAdmin
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}