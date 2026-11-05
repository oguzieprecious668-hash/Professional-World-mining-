import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!session.user.roles?.includes("ADMIN")) redirect("/forbidden");
  if (!session.user.mfaAuthenticated) redirect("/mfa-required");

  return (
    <main className="shell">
      <div className="notice">Protected route example only; no customer records or administrative actions are implemented.</div>
      <section className="card">
        <p className="eyebrow">Admin route guard</p>
        <h1>Admin framework</h1>
        <p>Access depends on verified identity-provider claims and MFA. Sensitive operations must also be authorized and audited by the API.</p>
      </section>
    </main>
  );
}
