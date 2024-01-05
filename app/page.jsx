import { Button } from "@/components/ui/button";
import LandingPageHeader from "@/layouts/LandingPageHeader";

import Link from "next/link";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <LandingPageHeader session={session} />
      <main className="container min-h-screen flex flex-col pt-64 gap-12 items-center">
        <h1 className="text-8xl font-semibold text-center leading-tighter">
          CRM, simpelthen.
        </h1>
        <p className="text-lg text-muted-foreground text-center ">
          Hold styr på dine kunder, og få overblik over dine kontakter.
        </p>

        <Button asChild variant="">
          <Link href="/signup" size="xl">
            Prøv gratis nu
          </Link>
        </Button>
      </main>
      <footer className="py-28">
        <p className="text-center">
          <Link href="https://www.monobryn.dk" asChild>
            <Button variant="link">© Monobryn 2024</Button>
          </Link>
        </p>
      </footer>
    </>
  );
}
