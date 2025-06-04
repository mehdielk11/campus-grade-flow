import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { status: 401, headers: corsHeaders });
    }
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    // Validate user
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401, headers: corsHeaders });
    }

    const { student_id, to_level, academic_year, promoted_by, promotion_reason, filiere } = await req.json();

    // 1. Fetch student and grades
    const { data: student, error: studentError } = await supabase.from('students').select('*').eq('id', student_id).single();
    if (studentError || !student) {
      return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404, headers: corsHeaders });
    }

    // 2. Check eligibility (all module grades >= 10 for current filiere/level)
    // ... existing eligibility logic ...

    // 3. Update student record
    // ... existing update logic ...

    // 4. Insert into academic history and promotions tables
    // ... existing insert logic ...

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: corsHeaders });
  }
}); 