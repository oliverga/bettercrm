"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  IconTag,
  IconCheck,
  IconCircle,
  IconCircleDotted,
} from "@tabler/icons-react";

import { useEffect, useState } from "react";

function SetStatus({ virksomhed, setVirksomhed, activeInput, setActiveInput }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          size="sm"
          onClick={() => setActiveInput("status")}
        >
          <IconCircleDotted className="h-4 w-4 mr-1" />
          <p className="translate-y-[1px]">
            {virksomhed && virksomhed.status ? virksomhed.status : "Status"}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Status" />
          <CommandGroup>
            <CommandItem
              className="flex items-center gap-2"
              onSelect={() => {
                setVirksomhed((prevVirksomhed) => ({
                  ...prevVirksomhed,
                  status: "Aktiv",
                }));
                setOpen(false);
              }}
            >
              <IconCheck className="h-4 w-4" />
              Aktiv
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SetStatus;
