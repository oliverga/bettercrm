import Header from "@/layouts/Header";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Separator } from "@/components/ui/separator";

async function page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="container relative mt-8">
      <Header session={session} />
      <main className="">
        <div className="">
          <Button asChild variant="ghost">
            <Link href="/dashboard" className="flex items-center text-sm">
              <IconChevronLeft className="h-4 w-4 mr-1" /> Tilbage
            </Link>
          </Button>
        </div>
        <section className="min-h-screen pt-12  max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Udseende</h2>
            {/* <div className="flex items-center gap-2">
              <p>Mørk tilstand</p>

            </div> */}
          </div>
          <Separator />
        </section>
      </main>
    </div>
  );
}

export default page;
