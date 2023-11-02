"use client";
import { use, useCallback, useEffect, useState } from "react";
import { useSupabase } from "../supabase-provider";
import { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "react-query";
import SearchForm, { SearchState } from "./SearchForm";

interface Job {
  id: string;
  company: string;
  title: string;
  date: string;
  location: string;
  status: "Applied" | "Interviewing" | "Offer Received" | "Rejected";
}

const placeHolderJobs: Job[] = [
  {
    id: "1as",
    company: "Microsoft",
    title: "Software Engineer",
    date: "2022-01-01",
    location: "Redmond, WA",
    status: "Applied",
  },
  {
    id: "4dsa",
    company: "Google",
    title: "Product Manager",
    date: "2022-02-01",
    location: "Mountain View, CA",
    status: "Interviewing",
  },
  {
    id: "3asd",
    company: "Amazon",
    title: "Data Scientist",
    date: "2022-03-01",
    location: "Seattle, WA",
    status: "Offer Received",
  },
];

export const renderDate = (date: string) => {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString("default", { month: "long" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const renderStatus = (status: string) => {
  switch (status) {
    case "Applied":
      return (
        <p className="mt-2">
          <span className="inline rounded bg-blue-500 px-3 py-2 text-sm font-bold text-white">
            {status}
          </span>
        </p>
      );
    case "Interviewing":
      return (
        <p className="mt-2">
          <span className="inline rounded bg-yellow-500 px-3 py-2 text-sm font-bold text-white">
            {status}
          </span>
        </p>
      );
    case "Offer Received":
      return (
        <p className="mt-2">
          <span className="inline rounded bg-lime-700 px-3 py-2 text-sm font-bold text-white">
            {status}
          </span>
        </p>
      );
    case "Rejected":
      return (
        <p className="mt-2">
          <span className="inline rounded bg-red-500 px-3 py-2 text-sm font-bold text-white">
            {status}
          </span>
        </p>
      );
  }
};

export default function JobsList() {
  // const [loading, setLoading] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [filters, setFilters] = useState<SearchState>({
    search: "",
    status: "All",
    sort: "latest",
  });
  const user = session?.user;
  const { supabase } = useSupabase();
  // const [jobs, setJobs] = useState<Job[]>([]);
  const queryClient = useQueryClient();
  const { isLoading, data, refetch } = useQuery(
    ["jobs", { uuid: user?.id }],
    async ({ queryKey }) => {
      const [, { uuid }] = queryKey as any;
      if (!uuid) return;
      let queryBuilder = supabase
        .from("jobs")
        .select(`id, company, title, date, location, status`);
      if (filters.search) {
        queryBuilder = queryBuilder.textSearch("company", filters.search);
      }
      if (filters.status !== "All") {
        queryBuilder = queryBuilder.eq("status", filters.status);
      }
      if (filters.sort === "latest") {
        queryBuilder = queryBuilder.order("date", { ascending: false });
      } else {
        queryBuilder = queryBuilder.order("date", { ascending: true });
      }
      let { data, error, status } = await queryBuilder.eq("user_id", uuid);

      if (error && status !== 406) {
        throw error;
      }

      return data;
    },
  );

  const jobs = (!isLoading && data) || [];

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      setSession(res.data.session);
    });
  }, [supabase.auth]);

  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <>
      <section className="w-full rounded-lg bg-white p-4 shadow-md">
        <SearchForm setFilters={setFilters} filters={filters} />
      </section>

      <section className="grid w-full grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-lg bg-white shadow-md">
            <div className="p-4">
              <div className="my-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {job.company}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{job.title}</p>
              </div>
              <hr />
              <div className="my-3 grid grid-cols-2 gap-2">
                <p className="mt-2 text-sm text-gray-500">
                  {renderDate(job.date)}
                </p>
                <p className="mt-2 text-sm text-gray-500">{job.location}</p>
                {renderStatus(job.status)}
              </div>
              <div className="flex justify-end p-4">
                <a
                  href={`/job/${job.id}`}
                  className="mr-2 rounded bg-green-100 px-4 py-2 font-bold text-green-900 hover:bg-green-500"
                >
                  Edit
                </a>
                <button
                  className="rounded bg-red-200 px-4 py-2 font-bold text-red-800 hover:bg-red-500"
                  // onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
