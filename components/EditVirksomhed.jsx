"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import parsePhoneNumber from "libphonenumber-js";

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
  IconEdit,
} from "@tabler/icons-react";
import { useKeyboardEvent } from "@/lib/hooks/useKeyboardEvent";
import InputButton from "./InputButton";
import AddTag from "./AddTag";
import SetStatus from "./SetStatus";

function EditVirksomhed({
  setData,
  session,
  setRowSelection,
  refreshData,
  open,
  setOpen,
  virksomhed,
  setVirksomhed,
}) {
  const supabase = createClientComponentClient();

  const [activeInput, setActiveInput] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [proxyVirksomhed, setProxyVirksomhed] = useState(virksomhed);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", session.user.id);
    setTags(data);
  };

  useEffect(() => {
    setProxyVirksomhed(virksomhed);
  }, [virksomhed]);

  useEffect(() => {
    fetchTags();
  }, []);

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

  // Update virksomhed in database
  const updateVirksomhed = async () => {
    try {
      const { data, error } = await supabase
        .from("virksomheder")
        .update(proxyVirksomhed)
        .eq("id", virksomhed.id);

      // Add new tags to database
      for (const tag of newTags) {
        const { data, error } = await supabase
          .from("tags")
          .insert([{ value: tag.value, user_id: session.user.id }]);
        if (error) {
          throw error;
        }
      }

      if (error) {
        throw error;
      } else {
        setVirksomhed(proxyVirksomhed);
        setNewTags([]);
        toast.success("Virksomhed opdateret");
      }
    } catch (error) {
      toast.error("Der skete en fejl");
      console.error("Error updating virksomhed: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpen(true);
                  setActiveInput(null);
                }}
              >
                <IconEdit className="h-4 w-4" />
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
          <DialogTitle className="mb-2">Rediger Virksomhed</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Navn"
          value={proxyVirksomhed.navn}
          onChange={(event) =>
            setProxyVirksomhed((prevState) => ({
              ...prevState,
              navn: event.target.value,
            }))
          }
          className="max-w-xs"
        />

        <Textarea
          placeholder="Beskrivelse"
          value={proxyVirksomhed.beskrivelse}
          onChange={(event) =>
            setProxyVirksomhed((prevState) => ({
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
                virksomhed={proxyVirksomhed}
                setVirksomhed={setProxyVirksomhed}
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
                  {proxyVirksomhed && proxyVirksomhed.telefonnr ? (
                    <IconPhone className="h-4 w-4 mr-1" />
                  ) : (
                    <IconPlus className="h-4 w-4 mr-1" />
                  )}
                  {proxyVirksomhed && proxyVirksomhed.telefonnr
                    ? parsePhoneNumber(proxyVirksomhed.telefonnr)
                      ? parsePhoneNumber(
                          proxyVirksomhed.telefonnr
                        ).formatInternational()
                      : proxyVirksomhed.telefonnr
                    : "Tlf."}
                </Button>
              ) : (
                <Button variant="outline" className="p-0" size="sm">
                  <PhoneInput
                    value={proxyVirksomhed ? proxyVirksomhed.telefonnr : ""}
                    placeholder="Tlf."
                    className=" bg-transparent px-0 text-xs w-fit h-full pl-3  placeholder:text-xs ring-0 outline-none active:outline-none focus:outline-none tlf-input"
                    onChange={(value) =>
                      setProxyVirksomhed((prevState) => ({
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
                virksomhed={proxyVirksomhed}
                setVirksomhed={setProxyVirksomhed}
                IconComponent={IconMail}
                placeholder="Email"
                autoFocus={true}
              />
              <InputButton
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                inputKey="hjemmeside"
                virksomhed={proxyVirksomhed}
                setVirksomhed={setProxyVirksomhed}
                IconComponent={IconId}
                placeholder="Hjemmeside"
                autoFocus={true}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <SetStatus
                virksomhed={proxyVirksomhed}
                setVirksomhed={setProxyVirksomhed}
                activeInput={activeInput}
                setActiveInput={setActiveInput}
              />
              <AddTag
                virksomhed={proxyVirksomhed}
                setVirksomhed={setProxyVirksomhed}
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                tags={tags}
                newTags={newTags}
                setNewTags={setNewTags}
                fetchTags={fetchTags}
              />
            </div>
          </div>
          <DialogClose asChild className=" place-self-end">
            <Button
              type="submit"
              onClick={() => {
                updateVirksomhed();
                setOpen(false);
              }}
            >
              Gem
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditVirksomhed;
