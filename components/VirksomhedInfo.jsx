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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputField from "./InputField";
import {
  IconCircle,
  IconId,
  IconMail,
  IconPhone,
  IconPlus,
  IconTag,
  IconLink,
} from "@tabler/icons-react";
import { Skeleton } from "./ui/skeleton";

function VirksomhedInfo({ params, session }) {
  const supabase = createClientComponentClient();
  const [virksomhed, setVirksomhed] = useState(null);
  const [virksomhedData, setVirksomhedData] = useState(null);
  const [activeInput, setActiveInput] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = params;
      const response = await supabase
        .from("virksomheder")
        .select("*")
        .eq("id", id);
      console.log(response.data);
      setVirksomhed(response.data[0]);
    };
    fetchData();
  }, [params, supabase]);

  if (!virksomhed) {
    return (
      <div className="mt-12 flex flex-col md:flex-row gap-4 mx-auto min-h-[112px]">
        <Skeleton className="max-w-[80px] w-full h-[28px]" />
      </div>
    );
  }

  return (
    <section className="mt-12 flex flex-col md:flex-row gap-4 mx-auto">
      <div className="flex flex-col gap-4 w-fit">
        <div>
          <h1 className="text-xl">{virksomhed.navn}</h1>
        </div>
        <div className="flex flex-wrap gap-1 max-w-xs">
          <InputField
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            inputKey="cvr"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            IconComponent={IconId}
            placeholder="CVR"
            autoFocus={true}
          />
          <InputField
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            inputKey="hjemmeside"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            IconComponent={IconLink}
            placeholder="Hjemmeside"
            autoFocus={true}
          />
          <InputField
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            inputKey="telefonnr"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            IconComponent={IconPhone}
            placeholder="Tlf"
            autoFocus={true}
          />

          <InputField
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            inputKey="email"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            IconComponent={IconMail}
            placeholder="Email"
            autoFocus={true}
          />
        </div>
      </div>
      <div className="max-w-xs text-sm text-muted-foreground self-end">
        <p>
          Monobryn er et forlag, der udgiver bøger om kunst, kultur og samfund.
        </p>
      </div>
    </section>
  );
}

export default VirksomhedInfo;
