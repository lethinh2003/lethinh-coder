import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContributeEmail from "../components/homePage/ContributeEmail";
import Introduce from "../components/homePage/Introduce";
import ShowBlogs from "../components/homePage/ShowBlogs";
import ShowCodes from "../components/homePage/ShowCodes";
import Layout from "../components/Layout";
import dbConnect from "../database/dbConnect";
import Blog from "../models/Blog";
import Code from "../models/Code";

const Home = (props) => {
  const dataSystem = useSelector((state) => state.system.data);
  const [mostDownloadsCode, setMostDownloadsCode] = useState([]);
  const [mostViewsCode, setMostViewsCode] = useState([]);

  let { newCode, newBlog } = props;
  useEffect(() => {
    if (newCode) {
      const sortByViews = [...JSON.parse(newCode)];
      const sortByDownloads = [...JSON.parse(newCode)];
      sortByDownloads.sort((a, b) => b.downloads - a.downloads);
      sortByViews.sort((a, b) => b.views - a.views);
      setMostDownloadsCode(sortByDownloads);
      setMostViewsCode(sortByViews);
    }
  }, []);
  useEffect(() => {
    console.log("downloads", mostDownloadsCode);
    console.log("views", mostViewsCode);
  }, [mostDownloadsCode, mostViewsCode]);

  return (
    <>
      {dataSystem && (
        <Head>
          <title> {dataSystem.meta_title}</title>
          <meta name="description" content={dataSystem.meta_desc} />
          <meta name="keywords" content={dataSystem.meta_keywords} />
          <meta name="author" content={dataSystem.meta_author} />
          <meta property="og:image" content={dataSystem.meta_thumbnail} />
          <meta property="og:title" content={dataSystem.meta_title} />
        </Head>
      )}
      <Layout>
        <Introduce />
        <ShowBlogs blogData={newBlog} title={"New Blog"}></ShowBlogs>
        <ShowCodes sourceCode={newCode} title={"New Code"}></ShowCodes>
        {mostDownloadsCode.length > 0 && <ShowCodes sourceCode={mostDownloadsCode} title={"Most Download"}></ShowCodes>}
        {mostViewsCode.length > 0 && <ShowCodes sourceCode={mostViewsCode} title={"Most View"}></ShowCodes>}
        <ContributeEmail />
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
  let newBlog = [];
  const test = await Promise.all([
    Code.find({ status: true }).limit(6).select("-link -__v").sort("-_id"),
    Blog.find({ status: true }).limit(6).select("-link -__v").sort("-_id"),
  ])
    .then((data) => {
      newCode = data[0];

      newBlog = data[1];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      newCode: JSON.stringify(newCode),
      newBlog: JSON.stringify(newBlog),
    },
  };
};
