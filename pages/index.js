import axios from "axios";
import Link from "next/link";
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
} from "@mui/material";

import ShowCodes from "../components/homePage/ShowCodes";
import Head from "next/head";
import Layout from "../components/Layout";
import dbConnect from "../database/dbConnect";
import Code from "../models/Code";
const Home = (props) => {
  const { newCode, mostDownloadsCode, mostViewsCode } = props;
  return (
    <>
      <Head>
        <meta property="og:image" content="https://i.imgur.com/f1EUuvU.png" />
      </Head>
      <Layout>
        <ShowCodes sourceCode={newCode} title={"New Code"}></ShowCodes>
        <ShowCodes sourceCode={mostDownloadsCode} title={"Most Download"}></ShowCodes>
        <ShowCodes sourceCode={mostViewsCode} title={"Most View"}></ShowCodes>
      </Layout>
    </>
  );
};

export default Home;
export const getServerSideProps = async () => {
  await dbConnect();
  let newCode = [];
  let mostDownloadsCode = [];
  let mostViewsCode = [];
  const test = await Promise.all([
    Code.find({}).limit(4).select("-link -__v").sort("-_id"),
    Code.find({}).sort("-downloads").limit(4).select("-link -__v"),
    Code.find({}).sort("-views").limit(4).select("-link -__v"),
  ])
    .then((data) => {
      newCode = data[0];
      mostDownloadsCode = data[1];
      mostViewsCode = data[2];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      newCode: JSON.stringify(newCode),
      mostDownloadsCode: JSON.stringify(mostDownloadsCode),
      mostViewsCode: JSON.stringify(mostViewsCode),
    },
  };
};
