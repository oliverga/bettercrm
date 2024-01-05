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
import { IconTag, IconCheck } from "@tabler/icons-react";

import { useEffect, useState } from "react";

function AddTag({
  virksomhed,
  setVirksomhed,
  activeInput,
  setActiveInput,
  tags,
}) {
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null); // New state variable for the selected tag

  useEffect(() => {
    console.log(tags);
  }, [tags]);

  useEffect(() => {
    if (activeInput === "tags") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [activeInput]);

  const handleSelect = async (currentValue) => {
    if (currentValue) {
      // If the current value is a string, add it to the newTags array
      // Add the tag to the virksomhed
      if (!virksomhed) {
        setVirksomhed({ tags: [] });
      } else {
        setVirksomhed((prevState) => {
          // Check if the tag is already in the virksomhed object
          const tagIndex = prevState.tags
            ? prevState.tags.indexOf(currentValue)
            : -1;
          if (tagIndex === -1) {
            // If it's not, add it
            return {
              ...prevState,
              tags: [...(prevState.tags || []), currentValue],
            };
          } else {
            // If it is, remove it
            return {
              ...prevState,
              tags: prevState.tags.filter((tag) => tag !== currentValue),
            };
          }
        });
      }
      // Reset the selected tag
      setSelectedTag(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          size="sm"
          onClick={() => setActiveInput("tags")}
        >
          <IconTag className="h-4 w-4 mr-2" />
          <span className="flex-grow">
            {virksomhed && virksomhed.tags && virksomhed.tags.length > 0
              ? virksomhed.tags.join(", ")
              : "Tilføj tag"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Find tag"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim() !== "") {
                if (selectedTag) {
                  handleSelect(selectedTag);
                  setSelectedTag(null); // Reset the selected tag
                } else if (
                  !tags.find((tag) => tag.value === e.target.value.trim())
                ) {
                  handleSelect(e.target.value);
                }
              }
            }}
          />
          <CommandEmpty>
            <p className="mb-2">Tilføj nyt tag</p>
            <kbd className="border p-1 rounded mt-2">Enter</kbd>
          </CommandEmpty>
          <CommandGroup>
            {tags?.map((tag) => (
              <CommandItem
                key={tag.value}
                value={tag.value}
                onSelect={(currentValue) => {
                  setSelectedTag(
                    currentValue === selectedTag ? "" : currentValue
                  );
                  handleSelect(
                    currentValue === selectedTag ? "" : currentValue
                  );
                }}
              >
                {virksomhed &&
                  virksomhed.tags &&
                  virksomhed.tags.includes(tag.value) && (
                    <IconCheck
                      className={
                        selectedTag === tag.value
                          ? "mr-2 h-4 w-4 opacity-100"
                          : "mr-2 h-4 w-4 opacity-0"
                      }
                    />
                  )}
                {tag.value}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default AddTag;
