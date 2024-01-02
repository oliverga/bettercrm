const { createClientComponentClient, createServerComponentClient } = require("@supabase/auth-helpers-nextjs");

export function signInClient(email, password) {
  const supabase = createClientComponentClient();
  supabase.signIn({ email, password });
}

export function signOutClient() {
  const supabase = createClientComponentClient();
  supabase.signOut();
}

export async function getAuthClient() {
  const supabase = createClientComponentClient();
    const { data: {session}} = await supabase.auth.getSession();
    return session;
}

export async function getAuthServer(cookies) {
  const supabase = createServerComponentClient({ cookies });
  const { data: {session}} = await supabase.auth.getSession();
  return session;
}