"use client";
import { use, useCallback, useEffect, useState } from "react";
import { useSupabase } from "../supabase-provider";
import { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "react-query";

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
  const user = session?.user;
  const { supabase } = useSupabase();
  // const [jobs, setJobs] = useState<Job[]>([]);
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    ["jobs", { uuid: user?.id }],
    async ({ queryKey }) => {
      const [, { uuid }] = queryKey as any;
      if (!uuid) return;
      let { data, error, status } = await supabase
        .from("jobs")
        .select(`id, company, title, date, location, status`)
        .eq("user_id", uuid);

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

  return (
    <>
      <section className="w-full rounded-lg bg-white p-4 shadow-md">
        <form className="w-full max-w-lg">
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-first-name"
              >
                First Name
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-red-500 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="grid-first-name"
                type="text"
                placeholder="Jane"
              />
              <p className="text-xs italic text-red-500">
                Please fill out this field.
              </p>
            </div>
            <div className="w-full px-3 md:w-1/2">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-last-name"
              >
                Last Name
              </label>
              <input
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="grid-last-name"
                type="text"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="w-full px-3">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-password"
              >
                Password
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="grid-password"
                type="password"
                placeholder="******************"
              />
              <p className="text-xs italic text-gray-600">
                Make it as long and as crazy as you&apos;d like
              </p>
            </div>
          </div>
          <div className="-mx-3 mb-2 flex flex-wrap">
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-city"
              >
                City
              </label>
              <input
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="grid-city"
                type="text"
                placeholder="Albuquerque"
              />
            </div>
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-state"
              >
                State
              </label>
              <div className="relative">
                <select
                  className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-state"
                >
                  <option>New Mexico</option>
                  <option>Missouri</option>
                  <option>Texas</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="grid-zip"
              >
                Zip
              </label>
              <input
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="grid-zip"
                type="text"
                placeholder="90210"
              />
            </div>
          </div>
        </form>
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
