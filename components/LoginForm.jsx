"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import Link from "next/link";

function LoginForm({ session }) {
  const router = useRouter();

  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    toast.success("Du er nu logget ud.");
    router.push("/");
  };

  const handleSignIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error("Login fejlede, tjek email og password");
      return;
    }
    router.refresh();
    toast.success("Du er nu logget ind");
    router.push("/dashboard");
  };

  return session ? (
    <Button
      onClick={() => {
        handleSignOut();
      }}
    >
      Log ud
    </Button>
  ) : (
    <div className="flex flex-col gap-4">
      <Input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
      <Input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        value={password}
        placeholder="Password"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSignIn(email, password);
          }
        }}
      />
      <Button onClick={() => handleSignIn(email, password)}>Log ind</Button>
      <Button asChild variant="link">
        <Link href="/signup">Opret bruger</Link>
      </Button>
    </div>
  );
}

export default LoginForm;
