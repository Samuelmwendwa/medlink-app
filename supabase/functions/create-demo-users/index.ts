import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Missing Supabase URL or service key environment variables",
      );
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Demo users to create
    const demoUsers = [
      {
        email: "admin@hospital.org",
        password: "password123",
        name: "Admin User",
        role: "Administrator",
      },
      {
        email: "doctor@hospital.org",
        password: "password123",
        name: "Dr. Jane Smith",
        role: "Medical Staff",
        department: "Emergency",
      },
      {
        email: "reception@hospital.org",
        password: "password123",
        name: "Reception Staff",
        role: "Reception",
      },
    ];

    const results = [];

    // Create each demo user
    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", user.email);

      if (existingUsers && existingUsers.length > 0) {
        results.push({ email: user.email, status: "already exists" });
        continue;
      }

      // Create user in auth
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.name,
            role: user.role,
            department: user.department,
          },
        });

      if (authError) {
        results.push({
          email: user.email,
          status: "error",
          message: authError.message,
        });
        continue;
      }

      // Create profile entry
      if (authUser.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authUser.user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department || null,
          },
        ]);

        if (profileError) {
          results.push({
            email: user.email,
            status: "error",
            message: profileError.message,
          });
        } else {
          results.push({ email: user.email, status: "created" });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
