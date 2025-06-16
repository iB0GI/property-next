import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { Account, Profile, User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign-in
    signIn: async ({
      user,
      account,
      profile,
      email,
      credentials,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) => {
      // ✅ Add your sign-in logic here
      return true; // Must return a boolean or a redirect URL string
    },

    // Modifies the session object
    async session({ session }: { session: any }) {
      // ✅ Example:
      // session.user.id = 'your-database-id';
      return session;
    },
  },
};
