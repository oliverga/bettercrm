"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import Link from "next/link";

function SignUpForm({ session }) {
  const router = useRouter();

  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Du er nu logget ud.");
    router.push("/");
  };

  const handleSignUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectUrl: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error("Signup fejlede, tjek email og password");
      return;
    }
    toast.success("Tjek din email for at bekræfte din konto");
    router.push("/login");
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
        id="email"
        placeholder="Email"
        autofocus={true}
      />
      <div>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          value={password}
          placeholder="Password"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSignUp(email, password);
            }
          }}
        />
      </div>
      <Button onClick={() => handleSignUp(email, password)}>
        Opret bruger
      </Button>
      <Button asChild variant="link">
        <Link href="/login" className="text-center">
          Har du en bruger?
          <br />
          Log ind
        </Link>
      </Button>
    </div>
  );
}

export default SignUpForm;
