"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import InputButton from "./InputButton";
import AddTag from "./AddTag";
import SetStatus from "./SetStatus";

function AddVirksomhed({ setData, session, setRowSelection, refreshData }) {
  const [virksomhed, setVirksomhed] = useState(null);
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", session.user.id);
    setTags(data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

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
          beskrivelse: virksomhed.beskrivelse,
          tags: virksomhed.tags,
          user_id: session.user.id,
        },
      ]);

      // Add new tags to database
      for (const tag of virksomhed.tags) {
        if (!tags.find((existingTag) => existingTag.value === tag)) {
          const { data, error } = await supabase
            .from("tags")
            .insert([{ value: tag, user_id: session.user.id }]);
          if (error) {
            console.error("Error adding new tag: ", error);
          }
        }
      }

      if (error) {
        toast.error("Der skete en fejl");
      } else {
        setOpen(false);
        setActiveInput(null);
        toast.success("Virksomhed tilføjet");
        refreshData();
        setVirksomhed(null);
        setRowSelection([]);
        setActiveInput(null);
      }
    } catch (error) {
      console.log(error);
    }
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

        <Textarea
          placeholder="Beskrivelse"
          onChange={(event) =>
            setVirksomhed((prevState) => ({
              ...prevState,
              beskrivelse: event.target.value,
            }))
          }
        />

        <div className="flex justify-between items-start ">
          <div className="flex flex-col gap-1 flex-wrap ">
            <div className="flex gap-1 flex-wrap">
              <InputButton
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
              <InputButton
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                inputKey="email"
                virksomhed={virksomhed}
                setVirksomhed={setVirksomhed}
                IconComponent={IconMail}
                placeholder="Email"
                autoFocus={true}
              />
              <InputButton
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                inputKey="hjemmeside"
                virksomhed={virksomhed}
                setVirksomhed={setVirksomhed}
                IconComponent={IconId}
                placeholder="Hjemmeside"
                autoFocus={true}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <SetStatus
                virksomhed={virksomhed}
                setVirksomhed={setVirksomhed}
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                session={session}
              />
              <AddTag
                virksomhed={virksomhed}
                setVirksomhed={setVirksomhed}
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                session={session}
                tags={tags}
              />
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
