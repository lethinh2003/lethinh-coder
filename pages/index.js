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
  const { newCode, newBlog, mostDownloadCode, mostViewCode, dataSystem } = props;

  return (
    <>
      <Layout>
        <Introduce dataSystem={dataSystem} />
        <ShowBlogs blogData={newBlog} title={"New Blog"}></ShowBlogs>
        <ShowCodes sourceCode={newCode} title={"New Code"}></ShowCodes>
        <ShowCodes sourceCode={mostDownloadCode} title={"Most Download"}></ShowCodes>
        <ShowCodes sourceCode={mostViewCode} title={"Most View"}></ShowCodes>
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
  const getMostDownloadCodes = CodeService.findCodes({
    query,
    sort: "-downloads",
    itemsOfPage: limitItems,
    select: "-__v -link -content",
  });
  const getMostViewCodes = CodeService.findCodes({
    query,
    sort: "-views",
    itemsOfPage: limitItems,
    select: "-__v -link -content",
  });

  const [newBlog, newCode, mostDownloadCode, mostViewCode] = await Promise.all([
    getNewBlogs,
    getNewCodes,
    getMostDownloadCodes,
    getMostViewCodes,
  ]);

  return {
    props: {
      newCode: JSON.stringify(newCode.data),
      newBlog: JSON.stringify(newBlog.data),
      mostDownloadCode: JSON.stringify(mostDownloadCode.data),
      mostViewCode: JSON.stringify(mostViewCode.data),
      dataSystem: JSON.stringify(dataSystem),
    },
    revalidate: 60,
  };
};
