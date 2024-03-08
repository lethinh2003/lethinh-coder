import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../database/dbConnect";
import UserService from "../../../services/server/UserService";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 40000,
      },
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    }),
    CredentialsProvider({
      id: "login",
      name: "login",

      async authorize(credentials, req) {
        await dbConnect();
        const { account, password } = credentials;
        const getUser = await UserService.loginAccount({
          account,
          password,
        });

        return getUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Account login
      if (account.provider === "login") {
        if (!user.status) {
          return false;
        }
        return true;
      }
      // Google login
      if (account.provider === "google") {
        try {
          if (!profile.email_verified) {
            return false;
          }
          await dbConnect();
          await UserService.loginWithGoogleAccount({
            email: profile.email,
            avatar: profile.picture,
            name: profile.name,
          });
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Login with Google
      if (profile) {
        await dbConnect();
        const getUser = await UserService.findDetailedUser({
          query: {
            account: profile.email,
          },
          select: "account role avatar",
        });

        token.account = getUser.account;
        token.role = getUser.role;
        token.id = getUser._id;
        token.avatar = getUser.avatar;
      }
      // Login with Account
      else if (user) {
        token.account = user.account;
        token.role = user.role;
        token.id = user._id;
        token.avatar = user.avatar;
      }
      return Promise.resolve(token);
    },

    async session({ session, user, token }) {
      session.user.account = token.account;
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.avatar = token.avatar;

      session.error = token.error;

      return session;
    },
  },
};

export default NextAuth(authOptions);
