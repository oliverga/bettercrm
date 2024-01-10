import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import parsePhoneNumber from "libphonenumber-js";

function InputButton({
  activeInput,
  setActiveInput,
  inputKey,
  virksomhed,
  setVirksomhed,
  IconComponent,
  placeholder,
  type = "text",
  autoFocus = false,
  onBlur = null,
  size,
}) {
  return activeInput !== inputKey ? (
    <Button
      variant="outline"
      className="w-fit flex items-center justify-center gap-2"
      size="sm"
      onClick={() => setActiveInput(inputKey)}
      onKeyDown={(event) => {
        if (event.key !== "Tab") {
          event.preventDefault();
          setActiveInput(inputKey);
        }
      }}
    >
      {virksomhed && virksomhed[inputKey] ? (
        <IconComponent className="h-4 w-4" />
      ) : (
        <IconPlus className="h-4 w-4" />
      )}
      <p className=" translate-y-[1px]">
        {virksomhed && virksomhed[inputKey]
          ? virksomhed[inputKey]
          : placeholder}
      </p>
    </Button>
  ) : (
    <Button variant="outline" className="p-0" size="sm">
      <input
        type={type}
        value={virksomhed ? virksomhed[inputKey] : ""}
        placeholder={placeholder}
        className=" bg-transparent text-xs w-fit h-full px-3  placeholder:text-xs  active:outline-none focus:outline-none"
        onChange={(event) =>
          setVirksomhed((prevState) => ({
            ...prevState,
            [inputKey]: event.target.value,
          }))
        }
        autoFocus={autoFocus}
        onBlur={onBlur}
        size={size}
      />
    </Button>
  );
}

export default InputButton;
