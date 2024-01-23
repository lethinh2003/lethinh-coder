import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import AuthService from "../services/client/AuthService";
const Logout = () => {
  const { data: session, status } = useSession();
  const handleLogOut = async () => {
    try {
      const data = await AuthService.logoutAccount({});
    } catch (err) {
      toast.error("Có lỗi khi đăng xuất tài khoản");
      console.log(err);
    }
  };
  useEffect(() => {
    if (session) {
      handleLogOut();
    }
  }, [session]);

  return (
    <>
      <Layout></Layout>
    </>
  );
};

export default Logout;
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  } else {
    return {
      props: {},
    };
  }
};
