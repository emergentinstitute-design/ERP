'use client';

import {
  User,
  Shield,
  Trash2,
  Star,
  StarOff,
} from 'lucide-react';

import RoleBadge from './RoleBadge';

type Props = {
  user: {
    id: string;
    role: string;
    email?: string;
    is_primary_admin?: boolean;
  };

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

export default function UserRow({
  user,
  processingId,
  currentUserRole,
  onDelete,
  onRoleChange,
  onSetPrimaryAdmin,
  onRemovePrimaryAdmin,
}: Props) {
  /*
  =====================================
  HIDE MASTER FROM ADMIN VIEW
  =====================================
  */

  if (
    currentUserRole === 'admin' &&
    user.role === 'master'
  ) {
    return null;
  }

  /*
  =====================================
  RULES
  =====================================
  */

  const isPrimaryAdmin =
    user.is_primary_admin;

  const isMaster =
    currentUserRole === 'master';

  /*
  =====================================
  PRIMARY ADMIN PROTECTION
  =====================================
  */

  // ADMIN CANNOT MODIFY PRIMARY ADMIN

  const adminCannotModifyPrimary =
    currentUserRole === 'admin' &&
    isPrimaryAdmin;

  // MASTER CAN MODIFY PRIMARY ADMIN

  const disableRoleChange =
    processingId === user.id ||
    adminCannotModifyPrimary;

  const disableDelete =
    processingId === user.id ||
    adminCannotModifyPrimary;

  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50 transition">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
          <User size={22} />
        </div>

        <div>
          <p className="font-bold text-slate-900 text-sm">
            {user.email || 'No Email'}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Shield
              size={12}
              className="text-blue-600"
            />

            <RoleBadge role={user.role} />

            {isPrimaryAdmin && (
              <span className="text-[10px] uppercase tracking-wider font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                Primary Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center gap-3">
        {user.role !== 'master' ? (
          <>
            {/* ROLE SELECT */}
            <select
              value={user.role}
              disabled={disableRoleChange}
              onChange={(e) =>
                onRoleChange(
                  user.id,
                  e.target.value as
                    | 'admin'
                    | 'teacher'
                )
              }
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none disabled:opacity-50"
            >
              <option value="teacher">
                Teacher
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

            {/* PRIMARY ADMIN CONTROLS */}
            {isMaster &&
              user.role === 'admin' && (
                <>
                  {!isPrimaryAdmin ? (
                    <button
                      onClick={() =>
                        onSetPrimaryAdmin(
                          user.id
                        )
                      }
                      disabled={
                        processingId ===
                        user.id
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-100 text-xs font-bold transition disabled:opacity-50"
                    >
                      <Star size={14} />

                      Make Primary
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        onRemovePrimaryAdmin(
                          user.id
                        )
                      }
                      disabled={
                        processingId ===
                        user.id
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold transition disabled:opacity-50"
                    >
                      <StarOff
                        size={14}
                      />

                      Remove Primary
                    </button>
                  )}
                </>
              )}

            {/* DELETE */}
            <button
              onClick={() =>
                onDelete(user.id)
              }
              disabled={disableDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 text-xs font-bold transition disabled:opacity-50"
            >
              <Trash2 size={14} />

              Delete
            </button>
          </>
        ) : (
          isMaster && (
            <div className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-2 rounded-xl">
              MASTER ACCOUNT
            </div>
          )
        )}
      </div>
    </div>
  );
}