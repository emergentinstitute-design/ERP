'use client';

import { BookOpen, Users, Clock } from 'lucide-react';

export default function TeacherPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
          Faculty Dashboard
        </h1>

        <p className="text-slate-500 font-medium">
          Manage your batches and daily attendance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TeacherStatCard
          icon={BookOpen}
          label="My Batches"
          value="4"
          color="text-blue-600"
          bg="bg-blue-50"
        />

        <TeacherStatCard
          icon={Users}
          label="Total Students"
          value="128"
          color="text-indigo-600"
          bg="bg-indigo-50"
        />

        <TeacherStatCard
          icon={Clock}
          label="Next Session"
          value="10:30 AM"
          color="text-orange-600"
          bg="bg-orange-50"
        />
      </div>

      {/* Empty State */}
      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-white">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen
            className="text-slate-400"
            size={32}
          />
        </div>

        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Class Content Coming Soon
        </h3>

        <p className="text-slate-500 max-w-xs mt-1">
          We are setting up your student lists and lecture schedules.
        </p>
      </div>
    </div>
  );
}

type TeacherStatCardProps = {
  icon: any;
  label: string;
  value: string;
  color: string;
  bg: string;
};

function TeacherStatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: TeacherStatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
      <div
        className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center`}
      >
        <Icon size={24} />
      </div>

      <div>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
          {label}
        </p>

        <p className="text-xl font-black text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}