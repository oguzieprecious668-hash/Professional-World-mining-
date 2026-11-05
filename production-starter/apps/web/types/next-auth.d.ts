import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      roles?: string[];
      mfaAuthenticated?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
    mfaAuthenticated?: boolean;
  }
}
