import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import LoginForm from "@/components/LoginForm";
import { redirect } from "next/navigation";

async function Login() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Button
        asChild
        variant="ghost"
        className="mt-4 ml-4 absolute top-0 left-0 z-50"
      >
        <Link href="/" className="flex items-center text-sm">
          <ChevronLeftIcon /> Tilbage
        </Link>
      </Button>
      <main className="relative h-screen flex flex-col justify-center items-center">
        <LoginForm session={session} />
      </main>
    </>
  );
}

export default Login;
