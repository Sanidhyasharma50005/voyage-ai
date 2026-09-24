import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates an authenticated Supabase client for Server Components,
 * Server Actions, or Route Handlers using user session cookies.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient(url, anonKey, {
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
          // Handled if invoked from Server Component
        }
      },
    },
  });
}

/**
 * Creates a privileged Admin client using the SUPABASE_SERVICE_ROLE_KEY.
 * ONLY for use in backend server routes (Razorpay verification, webhook fulfillment).
 * NEVER expose this or import in client components!
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey.includes('your-service-role')) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not configured. Admin actions will run in fallback simulation mode.');
  }

  return createClient(
    url,
    serviceRoleKey || 'placeholder-service-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
