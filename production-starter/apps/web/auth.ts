import NextAuth from "next-auth";

const issuer = process.env.AUTH_OIDC_ISSUER;
const clientId = process.env.AUTH_OIDC_CLIENT_ID;
const clientSecret = process.env.AUTH_OIDC_CLIENT_SECRET;

if (!issuer || !clientId || !clientSecret) {
  throw new Error("Missing required OIDC environment configuration");
}

function stringRoles(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((role): role is string => typeof role === "string");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 },
  providers: [
    {
      id: "workforce-oidc",
      name: "Organization sign-in",
      type: "oidc",
      issuer,
      clientId,
      clientSecret,
      checks: ["pkce", "state"],
    },
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        // Configure the IdP to issue a trusted `roles` claim. Never accept role
        // changes from a browser form or public registration request.
        token.roles = stringRoles(profile.roles);
        token.mfaAuthenticated = Array.isArray(profile.amr)
          && profile.amr.some((method) => method === "mfa" || method === "otp");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.roles = stringRoles(token.roles);
        session.user.mfaAuthenticated = token.mfaAuthenticated === true;
      }
      // Do not copy OAuth access/refresh tokens to the browser-visible session.
      return session;
    },
  },
  pages: { signIn: "/login" },
});
