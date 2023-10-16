"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useState } from "react";

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>();
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <>
      {isSignIn ? (
        <>
          <h1>Sign In</h1>
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            showLinks={false}
            providers={[]}
            redirectTo="http://localhost:3000/auth/callback"
          />
          <p>
            Dont have an account?{" "}
            <button
              onClick={() => setIsSignIn(false)}
              className="text-cyan-300"
            >
              Register
            </button>
          </p>
        </>
      ) : (
        <>
          <h1>Sign Up</h1>
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            showLinks={false}
            providers={[]}
            redirectTo="http://localhost:3000/auth/callback"
          />
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsSignIn(true)} className="text-cyan-300">
              Sign In
            </button>
          </p>
        </>
      )}
    </>
  );
}
