import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../database/dbConnect";
import User from "../../../models/User";
import UserService from "../../../services/server/UserService";

var jwt = require("jsonwebtoken");
async function refreshAccessToken(tokenObject) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await axios.post(`${process.env.NEXTAUTH_URL}/api/refresh-token`, {
      refreshToken: tokenObject.refresh_token,
    });
    return {
      ...tokenObject,
      access_token: tokenResponse.data.accessToken,
      refresh_token: tokenResponse.data.refreshToken,
      expire_access_token: tokenResponse.data.expireAccessToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    // maxAge: 60,
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
          const getUser = await UserService.loginWithGoogleAccount({
            email: profile.email,
            avatar: profile.picture,
            name: profile.name,
          });
          profile.account = getUser;
          return true;
        } catch (err) {
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      try {
        // Login with Google
        if (profile) {
          // Create an access token and a refresh token
          const generateAccessToken = jwt.sign(
            { account: profile.account.account, role: profile.account.role, id: profile.account._id },
            process.env.NEXTAUTH_SECRET,
            {
              expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRED,
            }
          );
          const generateRefreshToken = jwt.sign(
            { account: profile.account.account, role: profile.account.role, id: profile.account._id },
            process.env.NEXTAUTH_SECRET,
            {
              expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRED,
            }
          );
          const expireAccessToken = Math.round(Date.now() + parseInt(process.env.JWT_ACCESSTOKEN_EXPIRED));
          // Update the refreshToken to the database
          await dbConnect();
          const updateRefreshTokenUser = await User.findOneAndUpdate(
            {
              account: profile.account.account,
            },
            {
              refreshToken: generateRefreshToken,
            }
          );
          token.account = profile.account.account;
          token.role = profile.account.role;
          token.id = profile.account._id;
          token.avatar = profile.account.avatar;
          token.access_token = generateAccessToken;
          token.expire_access_token = expireAccessToken;
          token.refresh_token = generateRefreshToken;
        } else if (user) {
          console.log({ token });
          // Create an access token and a refresh token
          const generateAccessToken = jwt.sign(
            { account: user.account, role: user.role, id: user._id },
            process.env.NEXTAUTH_SECRET,
            {
              expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRED,
            }
          );
          const generateRefreshToken = jwt.sign(
            { account: user.account, role: user.role, id: user._id },
            process.env.NEXTAUTH_SECRET,
            {
              expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRED,
            }
          );
          const expireAccessToken = Math.round(Date.now() + parseInt(process.env.JWT_ACCESSTOKEN_EXPIRED));

          console.log("expire Accesstoken", expireAccessToken, process.env.JWT_ACCESSTOKEN_EXPIRED);
          // Update the refreshToken to the database
          await dbConnect();
          const updateRefreshTokenUser = await User.findOneAndUpdate(
            {
              account: user.account,
            },
            {
              refreshToken: generateRefreshToken,
            }
          );
          token.account = user.account;
          token.role = user.role;
          token.id = user._id;
          token.avatar = user.avatar;
          token.access_token = generateAccessToken;
          token.expire_access_token = expireAccessToken;
          token.refresh_token = generateRefreshToken;

          console.log({ token });
        }

        const shouldRefreshTime = Math.floor((token.expire_access_token - Date.now()) / 1000);
        console.log("remain time", shouldRefreshTime);
        // If the token is still valid, just return it.
        if (shouldRefreshTime > 60) {
          return Promise.resolve(token);
        }
        token = await refreshAccessToken(token);
        return Promise.resolve(token);
      } catch (err) {
        console.log(err);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },

    async session({ session, user, token }) {
      session.user.account = token.account;
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.avatar = token.avatar;
      session.user.access_token = token.access_token;
      session.user.refresh_token = token.refresh_token;
      session.user.expire_access_token = token.expire_access_token;
      session.error = token.error;
      console.log({
        session,
      });
      return session;
    },
  },
});
