import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import dbConnect from "../../../database/dbConnect";
import { comparePassword } from "../../../utils/hashPassword";
import bcrypt from "bcrypt";
import User from "../../../models/User";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import sendEmail from "../../../utils/email";
var randomstring = require("randomstring");
var jwt = require("jsonwebtoken");

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
    async session({ session, user, token }) {
      session.user.account = token.account;
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.avatar = token.avatar;
      session.user.access_token = token.access_token;

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (profile) {
        const generateToken = jwt.sign(
          { account: profile.account.account, role: profile.account.role, id: profile.account._id },
          process.env.NEXTAUTH_SECRET,
          {
            expiresIn: 60 * 60 * 24 * 90, ///Expire default jwt next-auth
          }
        );
        token.account = profile.account.account;
        token.role = profile.account.role;
        token.id = profile.account._id;
        token.avatar = profile.account.avatar;
        token.access_token = generateToken;
      } else if (user) {
        const generateToken = jwt.sign(
          { account: user.account, role: user.role, id: user._id },
          process.env.NEXTAUTH_SECRET,
          {
            expiresIn: 60 * 60 * 24 * 90, ///Expire default jwt next-auth
          }
        );
        token.account = user.account;
        token.role = user.role;
        token.id = user._id;
        token.avatar = user.avatar;
        token.access_token = generateToken;
      }
      return token;
    },
  },
});
