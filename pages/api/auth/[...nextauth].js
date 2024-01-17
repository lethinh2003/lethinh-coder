import axios from "axios";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../database/dbConnect";
import User from "../../../models/User";
import sendEmail from "../../../utils/email";
var randomstring = require("randomstring");
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
  session: {
    strategy: "jwt",
    // maxAge: 60,
  },
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
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

        const user = await User.findOne({
          account: account,
        });

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
    async signIn({ account, profile }) {
      // if (account.provider === "github") {
      //   console.log("account", account);
      //   console.log("profile", profile);
      //   const checkUser = await User.findOne({
      //     account: profile.login,
      //   });
      //   if (checkUser) {
      //     profile.account = checkUser;
      //   } else {
      //     const generatePassword = randomstring.generate({
      //       length: 10,
      //       charset: "alphabetic",
      //     });
      //     const createUser = User.create({
      //       account: profile.email,
      //       password: generatePassword,
      //       confirmPassword: generatePassword,
      //       avatar: profile.picture,
      //       name: profile.name,
      //     });
      //   }
      // } else
      if (account.provider === "google") {
        try {
          if (profile.email_verified) {
            await dbConnect();
            const checkUser = await User.findOne({
              account: profile.email,
            });
            if (!checkUser) {
              const generatePassword = randomstring.generate({
                length: 10,
                charset: "alphabetic",
              });
              const createUser = User.create({
                account: profile.email,
                password: generatePassword,
                confirmPassword: generatePassword,
                avatar: profile.picture,
                name: profile.name,
              });
              const message = `

            <div style=" width: 500px; padding: 10px;">
       
             <img src="https://i.imgur.com/U0BdIic.png" style="width: 40px; height: 40px" alt="Home Logo">
              <span>Hi there,</span>
              <p>Lời đầu tiên xin gửi lời cảm ơn đến bạn, vì đã ghé thăm trang web và đăng ký tham gia cùng với chúng tôi. 
              Sau đây là thông tin tài khoản của bạn: </p>
              <li >Tài khoản: ${profile.email}</li>
              <li >Mật khẩu: <b>${generatePassword}</b> </li>
              <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
         
          </div>  `;
              const sendMail = sendEmail({
                email: profile.email,
                subject: "[No Reply] Đăng ký tài khoản thành công",
                message,
              });
              const data = await Promise.all([createUser, sendMail]);

              profile.account = data[0];
            } else {
              profile.account = checkUser;
            }
          }
          return profile.email_verified;
        } catch (err) {
          return false;
        }
      }
      return true; // Do different verification for other providers that don't have `email_verified`
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
      console.log(session);

      return session;
    },
  },
});
