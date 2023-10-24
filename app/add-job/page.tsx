import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SupabaseProvider from "../supabase-provider";
import AddJobForm from "../components/AddJobForm";

export default async function AddJob() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SupabaseProvider>
        <AddJobForm />
      </SupabaseProvider>
    </main>
  );
}
