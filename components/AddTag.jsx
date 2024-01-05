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
  const [newTags, setNewTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null); // New state variable for the selected tag

  useEffect(() => {
    if (activeInput === "tags") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [activeInput]);

  const handleSelect = async (currentValue) => {
    setVirksomhed((prevVirksomhed) => {
      let newTags;
      if (
        prevVirksomhed &&
        prevVirksomhed.tags &&
        prevVirksomhed.tags.includes(currentValue)
      ) {
        newTags = prevVirksomhed.tags.filter((value) => value !== currentValue);
        setNewTags((prevNewTags) =>
          prevNewTags.filter((tag) => tag.value !== currentValue)
        );
      } else {
        newTags = [...(prevVirksomhed?.tags || []), currentValue];
        if (!tags.find((tag) => tag.value === currentValue)) {
          setNewTags((prevNewTags) => [
            ...prevNewTags,
            { value: currentValue },
          ]);
        }
      }
      return { ...prevVirksomhed, tags: newTags };
    });
  };

  const allTags = [...tags, ...newTags];
  const uniqueTags = Array.from(
    new Map(allTags.map((tag) => [tag["value"], tag])).values()
  );

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
          {virksomhed && virksomhed.tags && virksomhed.tags.length > 0 ? (
            virksomhed.tags.join(", ")
          ) : (
            <span>Tags</span>
          )}
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
            {uniqueTags.length > 0 &&
              uniqueTags.map((tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={() => {
                    setSelectedTag(tag.value);
                    handleSelect(tag.value);
                  }}
                >
                  <IconCheck
                    className={
                      "mr-2 h-4 w-4 " +
                      (virksomhed &&
                      virksomhed.tags &&
                      virksomhed.tags.includes(tag.value)
                        ? "opacity-100"
                        : "opacity-0")
                    }
                  />
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
