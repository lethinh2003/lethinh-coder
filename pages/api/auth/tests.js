//pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

var jwt = require("jsonwebtoken");

export default NextAuth({
  session: {
    strategy: "jwt",
    // maxAge: 60,
  },
  providers: [
    CredentialsProvider({
      id: "login",
      name: "login",

      async authorize(credentials, req) {
        //Này lấy từ hàm signIn("login") bên client
        const { account, password } = credentials;
        //Login vào server
        const res = await axios.post("/your/endpoint", {
          account: account,
          password: password,
        });
        //Gán user nếu thành công
        const user = res.data.data;
        if (!user) {
          throw new Error("No user found");
        }
        return user; //Return về user, sau đó user sẽ là tham số của hàm jwt ở dưới
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      return true;
    },
    async session({ session, user, token }) {
      ///Gán token vào session, chạy mỗi khi gọi hook useSession ở client.
      session.user.account = token.account;
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.avatar = token.avatar;
      session.user.access_token = token.access_token;

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //Chỉ chạy hàm này khi login.
      if (user) {
        const generateToken = jwt.sign(
          { account: user.account, role: user.role, id: user._id },
          process.env.NEXTAUTH_SECRET,
          {
            expiresIn: 60 * 60 * 24 * 30, ///Expire default jwt next-auth
          }
        );
        token.account = user.account;
        token.role = user.role;
        token.id = user._id;
        token.avatar = user.avatar;
        //Khi login thành công và có user, sẽ gán jwt được tạo cho token.access_token.
        token.access_token = generateToken;
      }
      return token;
    },
  },
});
///


////GET JWT FROM SESSION

import { useSession } from "next-auth/react";
const GetJwt = () => {
    const { data: session, status } = useSession();
    if (session && session.user) {
        //TOKEN ở đây
        console.log(session.user.access_token)
    }
    return(
        <>
            <h1>Get jsonwebtoken from session</h1>
        </>
    )
}
export default GetJwt;


//Login 

import {  signIn } from "next-auth/react";
import { useState } from "react";
const Login = () => {
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        const result = await signIn("login", {
            account: account,
            password:password,
            redirect: false, // Không chuyển hướng trang khi login
          });

    }
    return(
        <>
           <input type="text" value={account} onChange={(e) => setAccount(e.target.value)}  />
           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
           <input type="submit" onClick={() => handleSubmit()} />
        </>
    )
}
export default Login;

//Giả sử gửi request lên server và có gán token

import axios from "axios"
import { useState } from "react";
import { useSession } from "next-auth/react";

const RequestTest = () => {
    const { data: session, status } = useSession();
    if (session && session.user.access_token) {
        //Tiến hành config headers gán token mặc định khi dùng axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${session.user.access_token}`; 
      } else {
        axios.defaults.headers.common["Authorization"] = null;
      }
    const handleSubmit = async () => {
        const result = await axios.get("/test/endponit");
        //check token valid , hay invalid ....

    }
    return(
        <>
           <input type="submit" onClick={() => handleSubmit()} />
        </>
    )
}
export default RequestTest;