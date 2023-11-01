import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SupabaseProvider from "../../supabase-provider";
import EditJobForm from "../../components/EditJobForm";
import { notFound } from "next/navigation";

export default async function EditJob({
  params,
}: {
  params: { jobId: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: job,
    error,
    status,
  } = await supabase
    .from("jobs")
    .select(`id, company, title, date, location, status`)
    .eq("id", params.jobId)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  if (!job) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SupabaseProvider>
        <EditJobForm job={job} />
      </SupabaseProvider>
    </main>
  );
}
