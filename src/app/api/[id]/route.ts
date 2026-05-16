import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// =========================================================================
// Supabase Route Handler Client Instantiation
// Keeping this inline within the route file for a unified, clean setup.
// =========================================================================
export async function createRouteHandlerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Safe to ignore if called from read-only server contexts
          }
        },
      },
    }
  );
}

// =========================================================================
// GET: Fetch an existing student record
// Target Route: /api/admission/[uuid]
// =========================================================================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id === "new") {
    return NextResponse.json(
      { error: "Valid student UUID is required for fetching data" },
      { status: 400 }
    );
  }

  // Initializing your specific cookie-based handler client
  const supabase = await createRouteHandlerClient(); 

  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Student record not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =========================================================================
// POST: Create a new student record
// Target Route: /api/admission/new
// =========================================================================
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id !== "new") {
    return NextResponse.json(
      { error: "Use PUT method to update an existing record" },
      { status: 400 }
    );
  }

  const supabase = await createRouteHandlerClient();

  try {
    const formData = await request.json();

    if (!formData.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          ...formData,
          enquiry_id: formData.enquiry_id || null,
          total_fees: formData.total_fees ? parseFloat(formData.total_fees) : null,
          concession: formData.concession ? parseFloat(formData.concession) : null,
          date_of_birth: formData.date_of_birth || null,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { data, message: "Admission record created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Database Insert Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =========================================================================
// PUT: Update an existing student record
// Target Route: /api/admission/[uuid]
// =========================================================================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id === "new") {
    return NextResponse.json(
      { error: "Valid student ID is required for updating" },
      { status: 400 }
    );
  }

  const supabase = await createRouteHandlerClient();

  try {
    const formData = await request.json();

    const { data, error } = await supabase
      .from("students")
      .update({
        ...formData,
        enquiry_id: formData.enquiry_id || null,
        total_fees: formData.total_fees ? parseFloat(formData.total_fees) : null,
        concession: formData.concession ? parseFloat(formData.concession) : null,
        date_of_birth: formData.date_of_birth || null,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json(
      { data, message: "Admission record updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}