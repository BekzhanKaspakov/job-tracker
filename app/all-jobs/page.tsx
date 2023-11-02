"use client";
import SupabaseProvider from "../supabase-provider";
import JobsList from "../components/JobsList";
import { QueryClient, QueryClientProvider } from "react-query";

export default function AllJobs() {
  // const supabase = createServerComponentClient<Database>({ cookies });

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  const queryClient = new QueryClient();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-24">
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          <JobsList />
        </QueryClientProvider>
      </SupabaseProvider>
    </main>
  );
}
