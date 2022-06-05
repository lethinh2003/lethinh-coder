import Head from "next/head";
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

  let { newCode, mostDownloadsCode, mostViewsCode, newBlog } = props;

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
        <ShowCodes sourceCode={mostDownloadsCode} title={"Most Download"}></ShowCodes>
        <ShowCodes sourceCode={mostViewsCode} title={"Most View"}></ShowCodes>
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
    Code.find({ status: true }).sort("-downloads").limit(6).select("-link -__v"),
    Code.find({ status: true }).sort("-views").limit(6).select("-link -__v"),
    Blog.find({ status: true }).limit(6).select("-link -__v").sort("-_id"),
  ])
    .then((data) => {
      newCode = data[0];
      mostDownloadsCode = data[1];
      mostViewsCode = data[2];

      newBlog = data[3];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      newCode: JSON.stringify(newCode),
      mostDownloadsCode: JSON.stringify(mostDownloadsCode),
      mostViewsCode: JSON.stringify(mostViewsCode),
      newBlog: JSON.stringify(newBlog),
    },
  };
};
