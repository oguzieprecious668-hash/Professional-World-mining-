import { signIn } from "../../auth";

export default function LoginPage() {
  return (
    <main className="shell">
      <section className="card auth-card">
        <p className="eyebrow">Secure account access</p>
        <h1>Sign in</h1>
        <p>Authentication is delegated to the configured organization identity provider. No password is collected by this demo frontend.</p>
        <form action={async () => { "use server"; await signIn("workforce-oidc", { redirectTo: "/dashboard" }); }}>
          <button className="button" type="submit">Continue with secure sign-in</button>
        </form>
      </section>
    </main>
  );
}
