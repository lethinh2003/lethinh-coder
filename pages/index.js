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
import System from "../models/System";

const Home = (props) => {
  const dataSystem = useSelector((state) => state.system.data);
  const [mostDownloadsCode, setMostDownloadsCode] = useState([]);
  const [mostViewsCode, setMostViewsCode] = useState([]);

  let { newCode, newBlog, systemData } = props;
  systemData = JSON.parse(systemData);

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

  return (
    <>
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
    System.findOneAndUpdate(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
  ])
    .then((data) => {
      newCode = data[0];

      newBlog = data[1];
      systemData = data[2];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      newCode: JSON.stringify(newCode),
      newBlog: JSON.stringify(newBlog),
      systemData: JSON.stringify(systemData),
    },
  };
};
