import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import SignUpForm from "@/components/SignUpForm";

async function SignUp() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
        <SignUpForm session={session} />
      </main>
    </>
  );
}

export default SignUp;
