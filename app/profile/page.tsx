import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AccountForm from "./account-form";
import { Database } from "@/types/supabase";
import SupabaseProvider from "../supabase-provider";

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SupabaseProvider>
        <AccountForm />;
      </SupabaseProvider>
    </main>
  );
}
