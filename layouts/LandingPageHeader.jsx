"use client";

import { Button } from "@/components/ui/button";
import { IconMountain } from "@tabler/icons-react";
import Link from "next/link";

function LandingPageHeader({ session }) {
  return (
    <header className="absolute w-screen top-0 left-0">
      <nav className="container p-12 flex gap-1 justify-between">
        <div className="flex items-center gap-2 font-medium text-2xl ">
          <IconMountain className="h-8 w-8 text-purple-500" stroke="2" />
          <h2>Sherpa</h2>
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          {!session && (
            <div className=" space-x-2">
              <Button asChild variant="ghost">
                <Link href="/priser">Priser</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/login">Log ind</Link>
              </Button>
              <Button asChild variant="">
                <Link href="/signup">Opret bruger</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default LandingPageHeader;
