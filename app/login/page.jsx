"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import * as da from "@/lib/da";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // const handleSignUp = async () => {
  //   await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       emailRedirectTo: `${location.origin}/auth/callback`,
  //     },
  //   });
  //   router.refresh();
  // };

  // const handleSignIn = async () => {
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     toastError(error.message);
  //     return;
  //   }

  //   router.push("/");
  //   toastSuccess("Du er nu logget ind.");
  // };

  // const handleSignOut = async () => {
  //   await supabase.auth.signOut();
  //   router.refresh();
  //   toastSuccess("Du er nu logget ud.");
  // };

  return (
    <>
      <Button
        asChild
        variant="ghost"
        className="mt-4 ml-4 absolute top-0 left-0 z-50"
      >
        <Link href="/" className="flex items-center text-sm">
          <ChevronLeftIcon /> Tilbage
        </Link>
      </Button>
      <main className="relative h-screen flex flex-col justify-center items-center">
        <Card className="w-full max-w-sm p-8">
          <Auth
            supabaseClient={createClientComponentClient()}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            localization={{
              variables: da,
            }}
            redirectTo="http://localhost:3000/dashboard"
          />
        </Card>
      </main>
    </>
  );
}

export default Login;
