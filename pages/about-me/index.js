import Layout from "../../components/Layout";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Avatar, Stack, Box } from "@mui/material";
import { deepOrange, deepPurple } from "@mui/material/colors";
const AboutMe = () => {
  const { data: session, status } = useSession();
  console.log(status);
  console.log(session);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <>
      {status === "loading" && <h1>Loading...</h1>}
      {status === "authenticated" && session && session.user && (
        <>
          <Head>
            <title>Profile {session.user.account}</title>
          </Head>
          <Layout>
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>{session.user.account.charAt(0)}</Avatar>
                  </Box>
                  <h1>Hello {session.user.account}</h1>
                </Box>
              </Box>
            </>
          </Layout>
        </>
      )}
    </>
  );
};
export default AboutMe;
