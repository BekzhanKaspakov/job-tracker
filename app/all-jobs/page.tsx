import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AccountForm from "../components/AccountForm";
import SupabaseProvider from "../supabase-provider";
import JobsList from "../components/JobsList";

export default async function AllJobs() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SupabaseProvider>
        <JobsList />
      </SupabaseProvider>
    </main>
  );
}
