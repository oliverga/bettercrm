import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Header() {
  return (
    <header className="h-fit py-4 container">
      <Tabs defaultValue="virksomheder" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="virksomheder">Virksomheder</TabsTrigger>
          <TabsTrigger value="personer">Personer</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="virksomheder"></TabsContent>
        <TabsContent value="personer"></TabsContent> */}
      </Tabs>
    </header>
  );
}

export default Header;
