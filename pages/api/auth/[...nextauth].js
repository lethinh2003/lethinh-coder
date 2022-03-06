import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import dbConnect from "../../../database/dbConnect";
import { comparePassword } from "../../../utils/hashPassword";
import bcrypt from "bcrypt";
import User from "../../../models/User";
export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "login",
      name: "login",
      async authorize(credentials, req) {
        await dbConnect();
        const { account, password } = credentials;
        const user = await User.findOne({
          account: account,
        });
        console.log(user);
        if (!user) {
          throw new Error("No user found");
        }
        const authPassword = await bcrypt.compare(password, user.password);
        if (!authPassword) {
          throw new Error("Password incorrect");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session, user, token }) {
      session.user.account = token.account;
      session.user.role = token.role;
      session.user.id = token.id;

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.account = user.account;
        token.role = user.role;
        token.id = user._id;
      }
      return token;
    },
  },
});
