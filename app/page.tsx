import AuthForm from "@/components/AuthForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        <h1>Sign In</h1>
        <AuthForm />
      </section>
    </main>
  );
}
