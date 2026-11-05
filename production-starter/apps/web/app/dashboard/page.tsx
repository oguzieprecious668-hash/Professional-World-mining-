import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="shell">
      <div className="notice">Preview only. No account data, balances, or transactions are connected.</div>
      <section className="card">
        <p className="eyebrow">Authenticated area</p>
        <h1>Dashboard</h1>
        <p>Signed in as {session.user.email ?? "verified account"}. This starter does not display real financial information.</p>
      </section>
    </main>
  );
}
