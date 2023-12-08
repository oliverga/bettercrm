import DataTable from "@/components/DataTable";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function Home() {
  return (
    <>
      <main className="">
        <div className="mt-4 container">
          <Tabs defaultValue="virksomheder">
            <TabsList className>
              <TabsTrigger value="virksomheder">Virksomheder</TabsTrigger>
              <TabsTrigger value="personer">Personer</TabsTrigger>
            </TabsList>
            <TabsContent value="virksomheder" className="mt-8">
              <DataTable />
            </TabsContent>
            <TabsContent value="personer"></TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
