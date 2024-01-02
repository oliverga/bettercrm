"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Header({ session }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const signOutClient = async () => {
    await supabase.auth.signOut();
    toast.success("Du er nu logget ud.");
    router.push("/");
    location.reload();
  };

  return (
    <header className="absolute right-0 top-0 mr-8 w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://avatars.githubusercontent.com/u/7099699?v=4" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/indstillinger">Indstillinger</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Abonnement</DropdownMenuItem>
          <DropdownMenuSeparator />
          {session ? (
            <DropdownMenuItem asChild>
              <button
                onClick={() => {
                  signOutClient();
                }}
                className="w-full"
              >
                Log ud
              </button>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login">Log ind</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Header;
