import { supabase } from "@/lib/supabaseClient";

export async function generateStaticParams() {
  const { data } = await supabase.from("virksomheder").select("*");

  return data.map((virksomhed) => ({
    cvr: String(virksomhed.cvr),
  }));
}

export async function generateMetadata({ params }) {
  const { cvr } = params;
  const { data } = await supabase
    .from("virksomheder")
    .select("*")
    .eq("cvr", cvr);

  return {
    title: data[0].navn,
    description: data[0].navn,
  };
}

export default async function Page({ params }) {
  const { cvr } = params;
  const { data } = await supabase
    .from("virksomheder")
    .select("*")
    .eq("cvr", cvr);

  return (
    <>
      <div className="">
        <h1 className="text-3xl font-bold">{data[0].navn}</h1>
        <p className="text-xl">{data[0].cvr}</p>
        <p className="text-xl">{data[0].hjemmeside}</p>
        <p className="text-xl">{data[0].email}</p>
      </div>
    </>
  );
}
