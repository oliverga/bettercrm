import Header from "@/layouts/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

function page() {
  return (
    <div className="container relative mt-8">
      <Header />
      <main>
        <div>
          <Button asChild variant="ghost">
            <Link href="/dashboard" className="flex items-center text-sm">
              <ChevronLeftIcon /> Tilbage
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

export default page;
