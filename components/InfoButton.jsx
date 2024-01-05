import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import parsePhoneNumber from "libphonenumber-js";
import Link from "next/link";
import { toast } from "sonner";

const InfoButton = ({ inputKey, virksomhed, IconComponent, placeholder }) =>
  virksomhed && virksomhed[inputKey] ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="secondary"
            className="w-fit"
            size="sm"
            onClick={() => {
              if (inputKey === "cvr") {
                navigator.clipboard.writeText(virksomhed[inputKey]);
                toast("CVR kopieret til udklipsholder");
              }
            }}
          >
            <IconComponent className="h-4 w-4 mr-1" />
            {inputKey === "hjemmeside" ? (
              <Link
                href={
                  virksomhed[inputKey].startsWith("http") ||
                  virksomhed[inputKey].startsWith("https")
                    ? virksomhed[inputKey]
                    : `https://${virksomhed[inputKey]}`
                }
              >
                {virksomhed[inputKey]}
              </Link>
            ) : inputKey === "telefonnr" ? (
              <a href={`tel:${virksomhed[inputKey]}`}>
                {parsePhoneNumber(virksomhed[inputKey])
                  ? parsePhoneNumber(virksomhed[inputKey]).formatInternational()
                  : virksomhed[inputKey]}
              </a>
            ) : inputKey === "email" ? (
              <a href={`mailto:${virksomhed[inputKey]}`}>
                {virksomhed[inputKey]}
              </a>
            ) : (
              virksomhed[inputKey]
            )}
          </Button>
        </TooltipTrigger>
        {inputKey === "cvr" ? (
          <TooltipContent>Kopier CVR til udklipsholder</TooltipContent>
        ) : (
          <></>
        )}
      </Tooltip>
    </TooltipProvider>
  ) : (
    <></>
  );

export default InfoButton;
