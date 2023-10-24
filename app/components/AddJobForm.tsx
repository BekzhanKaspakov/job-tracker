"use client";
import { useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { useSupabase } from "../supabase-provider";

type Job = {
  id: number;
  company: string;
  title: string;
  date: string;
  location: string;
  status: string;
};

export default function AddJobForm() {
  const { supabase } = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Job>({
    id: 0,
    company: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    location: "",
    status: "Applied",
  });

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      setSession(res.data.session);
    });
  }, [supabase.auth]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || !session) return;
    if (!formData.company || !formData.title || !formData.date) {
      toast.error("Please fill out all fields!");
      return;
    }

    // handle form submission here
    try {
      setLoading(true);

      let { error } = await supabase.from("jobs").insert({
        user_id: session?.user?.id,
        company: formData.company,
        title: formData.title,
        date: formData.date,
        location: formData.location,
        status: formData.status,
      });
      if (error) throw error;
      toast.success("Job added successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="my-3">
              <label
                htmlFor="company"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Company
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="block flex-1 border-0 py-1.5 pl-1 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-0 sm:text-sm sm:leading-6 border-solid border-gray-300 drop-shadow"
              />
            </div>
            <div className="my-3">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="block flex-1 border-0 py-1.5 pl-1 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-0 sm:text-sm sm:leading-6 border-solid border-gray-300 drop-shadow"
              />
            </div>
            <div className="my-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="block flex-1 border-0 py-1.5 pl-1 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-0 sm:text-sm sm:leading-6 border-solid border-gray-300 drop-shadow"
              />
            </div>
            <div className="my-3">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="block flex-1 border-0 py-1.5 pl-1 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-0 sm:text-sm sm:leading-6 border-solid border-gray-300 drop-shadow"
              />
            </div>
            <div className="my-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="block flex-1 border-0 py-1.5 pl-1 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-0 sm:text-sm sm:leading-6 border-solid border-gray-300 drop-shadow"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <hr />
            <div className="flex justify-end p-4">
              <button
                type="submit"
                className="bg-green-100 hover:bg-green-500 text-green-900 font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-red-200 hover:bg-red-500 text-red-800 font-bold py-2 px-4 rounded"
                // onClick={() => handleDelete(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
