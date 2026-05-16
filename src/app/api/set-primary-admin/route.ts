import { NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

import { createRouteHandlerClient } from '@/lib/supabase/server-route';

export async function POST(req: Request) {
  try {
    /*
    =====================================
    AUTH USER
    =====================================
    */

    const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    /*
    =====================================
    CHECK ROLE
    ONLY MASTER CAN ACCESS
    =====================================
    */

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'master') {
      return NextResponse.json(
        { error: 'Only master can perform this action' },
        { status: 403 }
      );
    }

    /*
    =====================================
    GET BODY
    =====================================
    */

    const body = await req.json();

    const {
      userId,
      makePrimary,
    }: {
      userId: string;
      makePrimary: boolean;
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    /*
    =====================================
    ADMIN CLIENT
    =====================================
    */

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    /*
    =====================================
    CHECK TARGET USER
    =====================================
    */

    const { data: targetUser } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (targetUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admin can become primary admin' },
        { status: 400 }
      );
    }

    /*
    =====================================
    REMOVE EXISTING PRIMARY ADMIN
    =====================================
    */

    if (makePrimary) {
      const { error: resetError } =
        await supabaseAdmin
          .from('profiles')
          .update({
            is_primary_admin: false,
          })
          .eq('is_primary_admin', true);

      if (resetError) {
        return NextResponse.json(
          { error: resetError.message },
          { status: 400 }
        );
      }
    }

    /*
    =====================================
    UPDATE TARGET USER
    =====================================
    */

    const { error: updateError } =
      await supabaseAdmin
        .from('profiles')
        .update({
          is_primary_admin: makePrimary,
        })
        .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    /*
    =====================================
    SUCCESS
    =====================================
    */

    return NextResponse.json({
      success: true,
      message: makePrimary
        ? 'Primary admin assigned'
        : 'Primary admin removed',
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}