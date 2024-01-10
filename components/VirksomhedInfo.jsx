"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useState, useEffect, use } from "react";

import {
  IconId,
  IconMail,
  IconPhone,
  IconLink,
  IconBuilding,
} from "@tabler/icons-react";
import { Skeleton } from "./ui/skeleton";
import InfoButton from "./InfoButton";
import ManageVirksomhed from "./ManageVirksomhed";
import { useRouter } from "next/router";
import { useCallback } from "react";

function VirksomhedInfo({ params, session }) {
  const supabase = createClientComponentClient();
  const [virksomhed, setVirksomhed] = useState(null);
  const [activeInput, setActiveInput] = useState(null);

  const refreshData = useCallback(async () => {
    const { id } = params;
    const response = await supabase
      .from("virksomheder")
      .select("*")
      .eq("id", id);
    console.log(response.data);
    setVirksomhed(response.data[0]);
  }, [params, supabase]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateLocalStorage = useCallback(async () => {
    const { data, error } = await supabase.from("virksomheder").select("*");
    localStorage.setItem("virksomheder", JSON.stringify(data));
  }, [supabase]);

  useEffect(() => {
    updateLocalStorage();
  }, [virksomhed, updateLocalStorage]);

  if (!virksomhed) {
    return (
      <div className="mt-12 flex flex-col md:flex-row gap-4 mx-auto min-h-[120px]">
        <Skeleton className="max-w-[140px] w-full h-[36px]" />
      </div>
    );
  }

  return (
    <section className="mt-12 flex flex-col md:flex-row gap-4 mx-auto">
      <div className="flex flex-col gap-4 w-fit min-h-[120px]">
        <div className="flex items-center gap-3">
          <IconBuilding className="h-6 w-6" />
          <h1 className="text-xl">{virksomhed.navn}</h1>
          <ManageVirksomhed
            session={session}
            mode="edit"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            refreshData={refreshData}
          />
        </div>
        <div className="flex flex-wrap gap-1 max-w-xs">
          <InfoButton
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            inputKey="cvr"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            IconComponent={IconId}
            placeholder="CVR"
            autoFocus={true}
          />
          <InfoButton
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            inputKey="hjemmeside"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            IconComponent={IconLink}
            placeholder="Hjemmeside"
            autoFocus={true}
          />
          <InfoButton
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            inputKey="telefonnr"
            virksomhed={virksomhed}
            setVirksomhed={setVirksomhed}
            IconComponent={IconPhone}
            placeholder="Tlf"
            autoFocus={true}
          />

          <InfoButton
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
        {/* <div>
          {tags ? (
            tags.map((tag, index) => (
              <Badge key={index} className="w-fit" variant="outline">
                {tag.value}
              </Badge>
            ))
          ) : (
            <></>
          )}
        </div> */}
      </div>
      <div className="max-w-xs text-sm text-muted-foreground self-end">
        <p>{virksomhed.beskrivelse}</p>
      </div>
    </section>
  );
}

export default VirksomhedInfo;
