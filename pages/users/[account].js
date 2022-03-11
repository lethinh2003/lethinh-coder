import Layout from "../../components/Layout";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Skeleton,
} from "@mui/material";
import convertTime from "../../utils/convertTime";
import { deepOrange, deepPurple } from "@mui/material/colors";
import axios from "axios";
import Info from "../../components/users/Info";
import Notifies from "../../components/users/Notifies";
import Comments from "../../components/users/Comments";

const AboutMe = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (status === "unauthenticated") {
      return router.push("/");
    }
    if (session) {
      if (router.query.account !== session.user.account) {
        return router.push("/");
      }
    }
    const getUser = async () => {
      try {
        const result = await axios.get("/api/users?account=" + session.user.account);
        setIsLoading(false);

        setData(result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [status]);

  return (
    <>
      {!isLoading && data.length > 0 && (
        <>
          <Head>
            <title>Profile {session.user.account}</title>
          </Head>
        </>
      )}
      <Layout>
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              bgcolor: "background.default",
              justifyContent: "center",
              color: "text.primary",
              gap: "10px",
              padding: { xs: "40px 10px", md: "40px 20px" },
            }}
          >
            <Info isLoading={isLoading} data={data.length > 0 ? data[0].userInfo : []} />
            <Notifies isLoading={isLoading} data={data.length > 0 ? data[0].userNotifies : []} />
            <Comments isLoading={isLoading} data={data.length > 0 ? data[0].userComments : []} />
          </Box>
        </>
      </Layout>
    </>
  );
};
export default AboutMe;
