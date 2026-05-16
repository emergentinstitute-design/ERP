"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Plus, 
  Search, 
  UserCheck, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Loader2, 
  Inbox,
  ExternalLink
} from "lucide-react";

export default function EnquiriesDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const dashboardParam = params?.dashboard;

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enquiries")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) setEnquiries(payload.data || []);
      })
      .catch((err) => console.error("Error fetching leads:", err))
      .finally(() => setLoading(false));
  }, []);

  const getDashboardPath = (subPath: string) => {
    let activeDashboard = dashboardParam;
    
    if (!activeDashboard && typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/");
      if (pathSegments[1] && pathSegments[1] !== "enquiries") {
        activeDashboard = pathSegments[1];
      }
    }

    if (!activeDashboard || activeDashboard === "undefined") {
      return subPath; 
    }

    return `/${activeDashboard}${subPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing lead pipeline...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Enquiry Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Track and convert incoming student prospects.</p>
          </div>

          <button
            onClick={() => router.push(getDashboardPath("/enquiries/new"))}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New Enquiry
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Statistics Bar (Optional addition for UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard label="Total Enquiries" value={enquiries.length} icon={<Inbox className="text-blue-500" />} />
            <StatsCard label="Pending Follow-ups" value={enquiries.length} icon={<Phone className="text-amber-500" />} />
            <StatsCard label="Conversion Ready" value={0} icon={<UserCheck className="text-emerald-500" />} />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Student Profile</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Academic Target</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <Inbox className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-slate-900 font-semibold">No active enquiries</h3>
                        <p className="text-slate-500 text-sm max-w-xs mt-1">All leads have been processed. Click "New Enquiry" to add a prospect manually.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  enquiries.map((item: any) => (
                    <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {item.student_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.student_name}</p>
                            <p className="text-xs text-slate-500">Parent: {item.parent_name || 'Not provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-700 text-sm">
                            <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                            <span>{item.current_standard || "No Grade"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                            <span>{item.interested_course || "No Course"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>+91 {item.contact_number}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide 
                          ${item.status === 'Converted' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                          {item.status || 'Active Lead'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => router.push(getDashboardPath(`/admission/${item.id}`))}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md text-xs font-bold transition-all border border-transparent hover:border-indigo-100"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Enroll
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}