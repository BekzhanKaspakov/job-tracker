"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Logo from "./Logo";
import { Session, createClient } from "@supabase/supabase-js";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useSupabase } from "../supabase-provider";

export default function Header() {
  //TODO: find out how to get user in client component
  const { supabase } = useSupabase();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      setSession(res.data.session);
    });
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 w-10 h-10">
            <span className="sr-only">Your Company</span>
            <Logo />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 text-sm leading-6 font-semibold dark:text-slate-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-5">
          <a
            href="/"
            className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200"
          >
            Stats
          </a>
          <a
            href="/all-jobs"
            className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200"
          >
            All jobs
          </a>
          <a
            href="/add-job"
            className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200"
          >
            Add job
          </a>
          <a
            href="profile"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200"
          >
            Profile
          </a>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session != null ? (
            <a
              href="#"
              onClick={() => supabase.auth.signOut()}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200"
            >
              Log out <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <a
              href="/signin"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Logo />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="/all-jobs"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50  dark:text-slate-200"
                >
                  All Jobs
                </a>
                <a
                  href="/add-job"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50  dark:text-slate-200"
                >
                  Add Job
                </a>
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50  dark:text-slate-200"
                >
                  Stats
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50  dark:text-slate-200"
                >
                  Log in
                </a>
                {session != null ? (
                  <a
                    href="#"
                    onClick={() => supabase.auth.signOut()}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50  dark:text-slate-200"
                  >
                    Log out
                  </a>
                ) : (
                  <a
                    href="/signin"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50  dark:text-slate-200"
                  >
                    Log in
                  </a>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
