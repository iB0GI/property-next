import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
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
    async signIn({ user }) {
      await connectDB();
      const userExists = await UserModel.findOne({ email: user.email });
      if (!userExists) {
        await UserModel.create({
          email: user.email,
          username: user.name?.slice(0, 20),
          image: user.image,
        });
      }
      return true;
    },

    async session({ session }) {
      if (!session.user?.email) {
        return session;
      }

      const user = await UserModel.findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
      }

      return session;
    },
  },
};
