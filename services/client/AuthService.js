import axios from "axios";
import { signIn, signOut } from "next-auth/react";

class AuthService {
  static signUpAccount = async ({ account, password, confirmPassword, name }) => {
    const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/users`, {
      account,
      password,
      confirmPassword,
      name,
    });
    return response;
  };
  static loginAccount = async ({ account, password, callbackUrl = "/" }) => {
    const response = await signIn("login", {
      account: account,
      password: password,
      redirect: false,
      callbackUrl,
    });
    return response;
  };
  static logoutAccount = async ({ callbackUrl = "/" }) => {
    const response = await signOut({
      redirect: false,
      callbackUrl,
    });
    return response;
  };
}
export default AuthService;
