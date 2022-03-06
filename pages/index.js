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
import System from "../models/System";

const Home = (props) => {
  let { newCode, mostDownloadsCode, mostViewsCode, systemData } = props;
  systemData = JSON.parse(systemData);

  return (
    <>
      {systemData.length > 0 && (
        <Head>
          <title> {systemData[0].meta_title}</title>
          <meta name="description" content={systemData[0].meta_desc} />
          <meta name="keywords" content={systemData[0].meta_keywords} />
          <meta name="author" content={systemData[0].meta_author} />
          <meta property="og:image" content={systemData[0].meta_thumbnail} />
          <meta property="og:title" content={systemData[0].meta_title} />
        </Head>
      )}
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
  let systemData = [];
  const test = await Promise.all([
    Code.find({}).limit(4).select("-link -__v").sort("-_id"),
    Code.find({}).sort("-downloads").limit(4).select("-link -__v"),
    Code.find({}).sort("-views").limit(4).select("-link -__v"),
    System.find({}).select("-__v"),
    System.updateMany(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
  ])
    .then((data) => {
      newCode = data[0];
      mostDownloadsCode = data[1];
      mostViewsCode = data[2];
      systemData = data[3];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      newCode: JSON.stringify(newCode),
      mostDownloadsCode: JSON.stringify(mostDownloadsCode),
      mostViewsCode: JSON.stringify(mostViewsCode),
      systemData: JSON.stringify(systemData),
    },
  };
};
