import VirksomhedTable from "@/components/VirksomhedTable";
import Header from "@/layouts/Header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const fetchVirksomheder = async () => {
    const { data, error } = await supabase
      .from("virksomheder")
      .select("*")
      .eq("user_id", session.user.id);

    console.log(data);
  };

  fetchVirksomheder();

  return (
    <>
      <div className="container relative mt-8">
        <Header session={session} />
        <main>
          <div>
            <Tabs defaultValue="virksomheder" className="">
              <TabsList className>
                <TabsTrigger value="virksomheder">Virksomheder</TabsTrigger>
                <TabsTrigger value="kontakter">Kontakter</TabsTrigger>
                {/* <TabsTrigger value="Aktiviteter">Aktiviteter</TabsTrigger> */}
              </TabsList>
              <TabsContent value="virksomheder" className="mt-8">
                <VirksomhedTable session={session} d />
              </TabsContent>
              <TabsContent value="kontakter"></TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}
