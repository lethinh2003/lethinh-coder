import { useSession } from "next-auth/react";
import { useEffect } from "react";
const jwt = require("jsonwebtoken");

const RefreshTokenHandler = (props) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!!session) {
      const timeRemaining = Math.floor((session.user.expire_access_token - Date.now() - 60 * 1000) / 1000);
      console.log("time remain", timeRemaining);
      props.setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
