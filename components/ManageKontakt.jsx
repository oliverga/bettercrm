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

import InputButton from "./InputButton";
import {
  IconEdit,
  IconMail,
  IconPhone,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import SetStatus from "./SetStatus";

export default function ManageKontakt({
  session,
  mode,
  kontakt,
  table,
  refreshData,
  virksomhed,
}) {
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [editingKontakt, setEditingKontakt] = useState(kontakt);

  const id = uuidv4();

  useEffect(() => {
    if (open) {
      setEditingKontakt(kontakt);
    }
  }, [kontakt, open]);

  useEffect(() => {
    if (editingKontakt && editingKontakt.telefonnr === undefined) {
      setEditingKontakt({ ...editingKontakt, telefonnr: "" });
    }
  }, [editingKontakt]);

  const saveKontakt = async () => {
    let data;
    let error;
    try {
      if (mode === "edit") {
        ({ data, error } = await supabase
          .from("kontakter")
          .update({
            navn: editingKontakt.navn,
            email: editingKontakt.email,
            telefonnr: editingKontakt.telefon,
            beskrivelse: editingKontakt.beskrivelse,
          })
          .eq("id", editingKontakt.id));
        refreshData();
        setActiveInput(null);
      } else if (mode === "add") {
        ({ data, error } = await supabase.from("kontakter").insert([
          {
            id: id,
            navn: editingKontakt.navn,
            email: editingKontakt.email,
            telefonnr: editingKontakt.telefonnr,
            beskrivelse: editingKontakt.beskrivelse,
            user_id: session.user.id,
          },
        ]));
        setActiveInput(null);
        refreshData();
      }
      if (mode === "edit") {
        toast.success("Kontakt opdateret");
      } else if (mode === "add") {
        toast.success("Kontakt tilføjet");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {table === true ? (
          <button>Rediger</button>
        ) : mode === "add" ? (
          <Button className="" onClick={() => setOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Tilføj Kontakt
          </Button>
        ) : (
          <Button onClick={() => setOpen(true)} size="icon" variant="outline">
            <IconEdit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-2 flex gap-2 items-center">
            <IconUser className="h-6 w-6 " />
            {mode === "edit" ? "Rediger Kontakt" : "Tilføj Kontakt"}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Navn"
          value={editingKontakt ? editingKontakt.navn : ""}
          onChange={(event) =>
            setEditingKontakt((prevState) => ({
              ...prevState,
              navn: event.target.value,
            }))
          }
          className="max-w-xs"
        />

        <Textarea
          placeholder="Beskrivelse"
          value={editingKontakt ? editingKontakt.beskrivelse : ""}
          onChange={(event) =>
            setEditingKontakt((prevState) => ({
              ...prevState,
              beskrivelse: event.target.value,
            }))
          }
        />

        <div className="flex justify-between items-start ">
          <div className="flex flex-col gap-1 flex-wrap ">
            <div className="flex gap-1 flex-wrap">
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
                  {editingKontakt && editingKontakt.telefonnr ? (
                    <IconPhone className="h-4 w-4 mr-1" />
                  ) : (
                    <IconPlus className="h-4 w-4 mr-1" />
                  )}
                  {editingKontakt && editingKontakt.telefonnr
                    ? parsePhoneNumber(editingKontakt.telefonnr)
                      ? parsePhoneNumber(
                          editingKontakt.telefonnr
                        ).formatInternational()
                      : editingKontakt.telefonnr
                    : "Tlf."}
                </Button>
              ) : (
                <Button variant="outline" className="p-0" size="sm">
                  <PhoneInput
                    value={
                      editingKontakt && editingKontakt.telefonnr
                        ? editingKontakt.telefonnr
                        : ""
                    }
                    placeholder="Tlf."
                    className=" bg-transparent px-0 text-xs w-fit h-full pl-3  placeholder:text-xs ring-0 outline-none active:outline-none focus:outline-none tlf-input"
                    onChange={(value) =>
                      setEditingKontakt((prevState) => ({
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
                virksomhed={editingKontakt}
                setVirksomhed={setEditingKontakt}
                IconComponent={IconMail}
                placeholder="Email"
                autoFocus={true}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <SetStatus
                virksomhed={editingKontakt}
                setVirksomhed={setEditingKontakt}
                activeInput={activeInput}
                setActiveInput={setActiveInput}
              />
            </div>
          </div>
          <DialogClose asChild className=" place-self-end">
            <Button type="submit" onClick={saveKontakt}>
              {mode === "edit" ? "Gem" : "Tilføj"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
