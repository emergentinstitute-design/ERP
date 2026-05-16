import { NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

import { createRouteHandlerClient } from '@/lib/supabase/server-route';

export async function GET() {
  try {
    const supabase =
      await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    /*
    =====================================
    AUTH CHECK
    =====================================
    */

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    /*
    =====================================
    GET CURRENT USER ROLE
    =====================================
    */

    const { data: profile } =
      await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role;

    /*
    =====================================
    ACCESS CONTROL
    =====================================
    */

    if (
      role !== 'master' &&
      role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    /*
    =====================================
    ADMIN CLIENT
    =====================================
    */

    const supabaseAdmin = createClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .SUPABASE_SERVICE_ROLE_KEY!
    );

    /*
    =====================================
    FETCH USERS
    =====================================
    */

    const { data, error } =
      await supabaseAdmin
        .from('profiles')
        .select(
          `
          id,
          role,
          email,
          is_primary_admin
        `
        );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    /*
    =====================================
    HIDE MASTER FROM ADMIN
    =====================================
    */

    let users = data || [];

    if (role === 'admin') {
      users = users.filter(
        (user) =>
          user.role !== 'master'
      );
    }

    /*
    =====================================
    RESPONSE
    =====================================
    */

    return NextResponse.json({
      users,
      currentUserRole: role,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}