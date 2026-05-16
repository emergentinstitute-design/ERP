import DashboardLayout from '@/components/layout/DashboardLayout';

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // NOT LOGGED IN
  if (!user) {
    redirect('/login');
  }

  // GET PROFILE
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  // NO PROFILE
  if (!profile) {
    redirect('/login');
  }

  return (
    <DashboardLayout
      role={profile.role}
      userName={profile.email?.split('@')[0] || 'User'}
    >
      {children}
    </DashboardLayout>
  );
}