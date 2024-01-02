import DataTable from "@/components/DataTable";
import Header from "@/layouts/Header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="container relative mt-8">
        <Header session={session} />
        <main>
          <div>
            <Tabs defaultValue="virksomheder" className="">
              <TabsList className>
                <TabsTrigger value="virksomheder">Virksomheder</TabsTrigger>
                <TabsTrigger value="personer">Personer</TabsTrigger>
                <TabsTrigger value="Aktiviteter">Aktiviteter</TabsTrigger>
              </TabsList>
              <TabsContent value="virksomheder" className="mt-8">
                <DataTable session={session} />
              </TabsContent>
              <TabsContent value="personer"></TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}
