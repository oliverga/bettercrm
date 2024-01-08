"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import parsePhoneNumber from "libphonenumber-js";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

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
import SetStatus from "./SetStatus";
import { useRouter } from "next/navigation";

function ManageVirksomhed({ session, mode, virksomhed, setVirksomhed }) {
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [editingVirksomhed, setEditingVirksomhed] = useState(virksomhed);

  const id = uuidv4();
  const router = useRouter();

  useEffect(() => {
    setEditingVirksomhed(virksomhed);
  }, [virksomhed]);

  // Update or add virksomhed in database
  const saveVirksomhed = async () => {
    let data;
    try {
      let error;
      if (mode === "edit") {
        ({ data, error } = await supabase
          .from("virksomheder")
          .update({ ...editingVirksomhed })
          .eq("id", virksomhed.id));
        setVirksomhed(editingVirksomhed);
      } else if (mode === "add") {
        ({ data, error } = await supabase.from("virksomheder").insert([
          {
            navn: editingVirksomhed.navn,
            cvr: editingVirksomhed.cvr,
            telefonnr: editingVirksomhed.telefonnr,
            email: editingVirksomhed.email,
            hjemmeside: editingVirksomhed.hjemmeside,
            beskrivelse: editingVirksomhed.beskrivelse,
            user_id: session.user.id,
            id: id,
          },
        ]));
        setVirksomhed(editingVirksomhed);
      }
      if (mode === "edit") {
        toast.success("Virksomhed redigeret");
      }
      if (mode === "add") {
        router.push(`/virksomhed/${id}`);
        toast.success("Virksomhed tilføjet");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        {mode === "add" ? (
          <Button className="" onClick={() => setOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Tilføj Virksomhed
          </Button>
        ) : (
          <Button onClick={() => setOpen(true)} size="icon" variant="outline">
            <IconEdit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-2">
            {mode === "edit" ? "Rediger Virksomhed" : "Tilføj Virksomhed"}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Navn"
          value={editingVirksomhed ? editingVirksomhed.navn : ""}
          onChange={(event) =>
            setEditingVirksomhed((prevState) => ({
              ...prevState,
              navn: event.target.value,
            }))
          }
          className="max-w-xs"
        />

        <Textarea
          placeholder="Beskrivelse"
          value={editingVirksomhed ? editingVirksomhed.beskrivelse : ""}
          onChange={(event) =>
            setEditingVirksomhed((prevState) => ({
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
                virksomhed={editingVirksomhed}
                setVirksomhed={setEditingVirksomhed}
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
                  {editingVirksomhed && editingVirksomhed.telefonnr ? (
                    <IconPhone className="h-4 w-4 mr-1" />
                  ) : (
                    <IconPlus className="h-4 w-4 mr-1" />
                  )}
                  {editingVirksomhed && editingVirksomhed.telefonnr
                    ? parsePhoneNumber(editingVirksomhed.telefonnr)
                      ? parsePhoneNumber(
                          editingVirksomhed.telefonnr
                        ).formatInternational()
                      : editingVirksomhed.telefonnr
                    : "Tlf."}
                </Button>
              ) : (
                <Button variant="outline" className="p-0" size="sm">
                  <PhoneInput
                    value={editingVirksomhed ? editingVirksomhed.telefonnr : ""}
                    placeholder="Tlf."
                    className=" bg-transparent px-0 text-xs w-fit h-full pl-3  placeholder:text-xs ring-0 outline-none active:outline-none focus:outline-none tlf-input"
                    onChange={(value) =>
                      setEditingVirksomhed((prevState) => ({
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
                virksomhed={editingVirksomhed}
                setVirksomhed={setEditingVirksomhed}
                IconComponent={IconMail}
                placeholder="Email"
                autoFocus={true}
              />
              <InputButton
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                inputKey="hjemmeside"
                virksomhed={editingVirksomhed}
                setVirksomhed={setEditingVirksomhed}
                IconComponent={IconId}
                placeholder="Hjemmeside"
                autoFocus={true}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <SetStatus
                virksomhed={editingVirksomhed}
                setVirksomhed={setEditingVirksomhed}
                activeInput={activeInput}
                setActiveInput={setActiveInput}
              />
            </div>
          </div>
          <DialogClose asChild className=" place-self-end">
            <Button type="submit" onClick={saveVirksomhed}>
              {mode === "edit" ? "Gem" : "Tilføj"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageVirksomhed;
