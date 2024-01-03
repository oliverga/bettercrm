"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import {
  IconCircle,
  IconId,
  IconMail,
  IconPhone,
  IconPlus,
  IconTag,
  IconLink,
} from "@tabler/icons-react";
import { useKeyboardEvent } from "@/lib/hooks/useKeyboardEvent";
import InputField from "./InputField";

function AddVirksomhed({ setData, session, setRowSelection }) {
  const [virksomhed, setVirksomhed] = useState(null);
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(true);
  const [activeInput, setActiveInput] = useState(null);

  // Add virksomhed to database
  async function addVirksomhed() {
    try {
      const { data, error } = await supabase.from("virksomheder").insert([
        {
          navn: virksomhed.navn,
          cvr: virksomhed.cvr,
          telefonnr: virksomhed.telefonnr,
          email: virksomhed.email,
          hjemmeside: virksomhed.hjemmeside,
          user_id: session.user.id,
        },
      ]);
      if (error) throw error;

      setOpen(false);
      setActiveInput(null);
      toast.success("Virksomhed tilføjet");
    } catch (error) {
      toast.error("Der skete en fejl");
    }

    const { data, error } = await supabase
      .from("virksomheder")
      .select("*")
      .order("created_at", { ascending: false });
    setData(data);

    setVirksomhed(null);
    setRowSelection([]);
    setActiveInput(null);
  }

  // Open dialog on cmd+a
  useKeyboardEvent("a", (event) => {
    if (event.metaKey || event.altKey) {
      setOpen(true);
      setActiveInput(null);
    }
  });

  // Close dialog on escape
  useEffect(() => {
    if (open === true) {
      addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          setOpen(false);
          setActiveInput(null);
        } else if (event.type === "mousedown") {
          setActiveInput(null);
        }
      });
    }
  }, [open, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="" onClick={() => setOpen(true)}>
                <IconPlus className="h-4 w-4 mr-2" />
                Tilføj Virksomhed
              </Button>
            </TooltipTrigger>

            <TooltipContent side="top">
              <kbd>cmd</kbd> + <kbd>a</kbd>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-2">Tilføj Virksomhed</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Navn"
          onChange={(event) =>
            setVirksomhed((prevState) => ({
              ...prevState,
              navn: event.target.value,
            }))
          }
          className="max-w-xs"
        />

        <Textarea placeholder="Beskrivelse" />

        <div className="flex justify-between items-start ">
          <div className="flex flex-col gap-1 flex-wrap ">
            <div className="flex gap-1 flex-wrap">
              <InputField
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                inputKey="cvr"
                virksomhed={virksomhed}
                setVirksomhed={setVirksomhed}
                IconComponent={IconId}
                placeholder="CVR"
                autoFocus={true}
                size="8"
              />
              {activeInput !== "tlf" ? (
                <Button
                  variant="outline"
                  className="w-fit"
                  size="sm"
                  onClick={() => setActiveInput("tlf")}
                  onKeyDown={(event) => {
                    if (event.key !== "Tab") {
                      event.preventDefault();
                      setActiveInput("tlf");
                    }
                  }}
                >
                  {virksomhed && virksomhed.telefonnr ? (
                    <IconPhone className="h-4 w-4 mr-1" />
                  ) : (
                    <IconPlus className="h-4 w-4 mr-1" />
                  )}
                  {virksomhed && virksomhed.telefonnr
                    ? virksomhed.telefonnr
                    : "Tlf."}
                </Button>
              ) : (
                <Button variant="outline" className="p-0" size="sm">
                  <PhoneInput
                    value={virksomhed ? virksomhed.telefonnr : ""}
                    placeholder="Tlf."
                    className=" bg-transparent px-0 text-xs w-fit h-full pl-3  placeholder:text-xs ring-0 outline-none active:outline-none focus:outline-none tlf-input"
                    onChange={(value) =>
                      setVirksomhed((prevState) => ({
                        ...prevState,
                        telefonnr: value,
                      }))
                    }
                    autoFocus
                    international
                    size="18"
                    limitMaxLength={true}
                    defaultCountry="DK"
                    countrySelectProps={{ unicodeFlags: true }}
                  />
                </Button>
              )}
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
              <InputField
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                inputKey="hjemmeside"
                virksomhed={virksomhed}
                setVirksomhed={setVirksomhed}
                IconComponent={IconId}
                placeholder="Hjemmeside"
                autoFocus={true}
                onBlur={() => setActiveInput(null)}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <Button variant="outline" className="" size="sm">
                <IconCircle className="h-4 w-4 mr-1" />
                Status
              </Button>
              <Button variant="outline" className="" size="sm">
                <IconTag className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogClose asChild className=" place-self-end">
            <Button type="submit" onClick={addVirksomhed}>
              Tilføj
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddVirksomhed;
