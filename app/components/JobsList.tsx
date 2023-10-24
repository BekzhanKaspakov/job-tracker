"use client";
import { use, useCallback, useEffect, useState } from "react";
import { useSupabase } from "../supabase-provider";
import { Session } from "@supabase/supabase-js";

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
    id: "1",
    company: "Microsoft",
    title: "Software Engineer",
    date: "2022-01-01",
    location: "Redmond, WA",
    status: "Applied",
  },
  {
    id: "4",
    company: "Google",
    title: "Product Manager",
    date: "2022-02-01",
    location: "Mountain View, CA",
    status: "Interviewing",
  },
  {
    id: "3",
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
          <span className="text-sm text-white bg-blue-500 font-bold rounded px-3 py-2 inline">
            {status}
          </span>
        </p>
      );
    case "Interviewing":
      return (
        <p className="mt-2">
          <span className="text-sm text-white bg-yellow-500 font-bold rounded px-3 py-2 inline">
            {status}
          </span>
        </p>
      );
    case "Offer Received":
      return (
        <p className="mt-2">
          <span className="text-sm text-white bg-lime-700 font-bold rounded px-3 py-2 inline">
            {status}
          </span>
        </p>
      );
    case "Rejected":
      return (
        <p className="mt-2">
          <span className="text-sm text-white bg-red-500 font-bold rounded px-3 py-2 inline">
            {status}
          </span>
        </p>
      );
  }
};

export default function JobsList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const user = session?.user;
  const { supabase } = useSupabase();
  const [jobs, setJobs] = useState<Job[]>([]);

  const getJobs = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("jobs")
        .select(`id, company, title, date, location, status`)
        .eq("user_id", user?.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setJobs([...data, ...placeHolderJobs]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getJobs();
  }, [user, getJobs]);

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      setSession(res.data.session);
    });
  }, [supabase.auth]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-lg shadow-md">
          <div className="p-4">
            <div className="my-3">
              <h3 className="text-lg font-medium text-gray-900">
                {job.company}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{job.title}</p>
            </div>
            <hr />
            <div className="grid grid-cols-2 gap-2 my-3">
              <p className="mt-2 text-sm text-gray-500">
                {renderDate(job.date)}
              </p>
              <p className="mt-2 text-sm text-gray-500">{job.location}</p>
              {renderStatus(job.status)}
            </div>
            <div className="flex justify-end p-4">
              <button className="bg-green-100 hover:bg-green-500 text-green-900 font-bold py-2 px-4 rounded mr-2">
                Edit
              </button>
              <button
                className="bg-red-200 hover:bg-red-500 text-red-800 font-bold py-2 px-4 rounded"
                // onClick={() => handleDelete(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
