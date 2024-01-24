import { NextSeo } from "next-seo";
import Layout from "../components/Layout";
import Introduce from "../components/homePage/Introduce";
import ShowBlogs from "../components/homePage/ShowBlogs";
import ShowCodes from "../components/homePage/ShowCodes";
import SubscribeEmail from "../components/homePage/SubscribeEmail";
import dbConnect from "../database/dbConnect";
import RedisService from "../services/client/RedisService";
import BlogService from "../services/server/BlogService";
import CodeService from "../services/server/CodeService";
const Home = (props) => {
  const { newCode, newBlog, dataSystem } = props;

  return (
    <>
      <NextSeo title="Trang chủ" description="Trang chủ" />

      <Layout>
        <Introduce dataSystem={dataSystem} />
        <ShowBlogs blogData={newBlog} title={"New Blog"}></ShowBlogs>
        <ShowCodes sourceCode={newCode} title={"New Code"}></ShowCodes>
        <SubscribeEmail />
      </Layout>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const dataSystem = await RedisService.getDataSystem();
  await dbConnect();
  const limitItems = 6;
  let query = {
    status: true,
  };

  const getNewBlogs = BlogService.findBlogs({
    query,
    sort: "-createdAt",
    itemsOfPage: limitItems,
    select: "-__v",
  });
  const getNewCodes = CodeService.findCodes({
    query,
    sort: "-createdAt",
    itemsOfPage: limitItems,
    select: "-__v -link -content",
  });

  const [newBlog, newCode] = await Promise.all([getNewBlogs, getNewCodes]);

  return {
    props: {
      newCode: JSON.stringify(newCode.data),
      newBlog: JSON.stringify(newBlog.data),
      dataSystem: JSON.stringify(dataSystem),
    },
    revalidate: 60,
  };
};
