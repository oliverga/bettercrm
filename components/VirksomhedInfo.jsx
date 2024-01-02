"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useState, useEffect } from "react";

function VirksomhedInfo({ params, session }) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = params;
      const response = await supabase
        .from("virksomheder")
        .select("*")
        .eq("id", id);
      console.log(response.data);
      setData(response.data[0]);
    };
    fetchData();
  }, [params, supabase]);

  if (!data) {
    return (
      <div className="mt-12 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto min-h-[160px]"></div>
    );
  }

  return (
    <section className="mt-12 flex flex-col md:flex-row gap-4 mx-auto min-h-[160px]">
      <div className="flex flex-col gap-4 w-full ">
        <div>
          <h1>{data.navn}</h1>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(data.cvr.toString());
                      toastMessage("CVR kopieret til udklipsholder");
                    }}
                    className="cursor-pointer"
                  >
                    {data.cvr}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Kopier til udklipsholder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="">
          <p>{data.hjemmeside}</p>
          <p>{data.telefonnr}</p>
          <p>{data.email}</p>
        </div>
      </div>
    </section>
  );
}

export default VirksomhedInfo;
