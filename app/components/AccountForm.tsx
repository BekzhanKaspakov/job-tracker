"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import Avatar from "./Avatar";

export default function AccountForm() {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const user = session?.user;

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      setSession(res.data.session);
    });
  }, [supabase.auth]);

  // const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log("user?.id", user?.id);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user?.id || "")
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log(error);
      // alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      let { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          Profile
        </h2>
        {user && (
          <Avatar
            uid={user!.id}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ fullname, username, website, avatar_url: url });
            }}
          />
        )}
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          This information will be displayed publicly so be careful what you
          share.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4   sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Username
            </label>

            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                className="block flex-1 rounded-md border-2 border-solid border-gray-300 py-1.5 pl-1 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-gray-100 sm:text-sm sm:leading-6"
                placeholder="janesmith"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Full Name
            </label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="fullname"
                id="fullname"
                autoComplete="fullname"
                className="block flex-1 rounded-md border-2 border-gray-300 py-1.5 pl-1 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-gray-100 sm:text-sm sm:leading-6"
                placeholder="janesmith"
                value={fullname || ""}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Avatar URL
            </label>

            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="avatar_url"
                id="avatar_url"
                autoComplete="avatar_url"
                className="block flex-1 rounded-md border-2 border-gray-300 py-1.5 pl-1 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-gray-100 sm:text-sm sm:leading-6"
                placeholder="janesmith"
                value={avatar_url || ""}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Website
            </label>

            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="website"
                id="website"
                autoComplete="website"
                className="block flex-1 rounded-md border-2 border-gray-300 py-1.5 pl-1 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-gray-100 sm:text-sm sm:leading-6"
                placeholder="janesmith"
                value={website || ""}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          {/* <div className="col-span-full">
            <label
              htmlFor="photo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Photo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              <svg
                className="h-12 w-12 text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Change
              </button>
            </div>
          </div> */}
          <div className="col-span-full">
            <button
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
              onClick={(e) => {
                e.preventDefault();
                updateProfile({ fullname, username, website, avatar_url });
              }}
              disabled={loading}
            >
              {loading ? "Loading ..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
