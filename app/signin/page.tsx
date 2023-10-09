import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        <AuthForm />
      </section>
    </main>
  );
}
