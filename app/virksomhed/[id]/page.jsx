import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/layouts/Header";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconChevronLeft } from "@tabler/icons-react";

import { cookies } from "next/headers";
import VirksomhedInfo from "@/components/VirksomhedInfo";
import KontaktTable from "@/components/KontaktTable";

export default async function Page({ params }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <div className="container relative mt-8">
        <Header session={session} />
        <main>
          <div>
            <Button asChild variant="ghost">
              <Link href="/dashboard" className="flex items-center text-sm">
                <IconChevronLeft className="h-4 w-4 mr-1" /> Tilbage
              </Link>
            </Button>
          </div>
          <VirksomhedInfo params={params} session={session} />
          <KontaktTable params={params} session={session} />
        </main>
      </div>
    </>
  );
}
