import axios from "axios";
import Layout from "../components/Layout";
import Introduce from "../components/homePage/Introduce";
import ShowBlogs from "../components/homePage/ShowBlogs";
import ShowCodes from "../components/homePage/ShowCodes";
import SubscribeEmail from "../components/homePage/SubscribeEmail";
import dbConnect from "../database/dbConnect";
import System from "../models/System";
const Home = (props) => {
  const { newCode, newBlog, systemData, mostDownloadCode, mostViewCode } = props;

  return (
    <>
      <Layout>
        <Introduce />
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
export const getServerSideProps = async () => {
  await dbConnect();
  const limitItems = 6;
  const latestSort = "-_id";
  const downloadSort = "-downloads";
  const viewSort = "-views";
  const getNewBlogs = axios.get(`${process.env.NEXTAUTH_URL}/api/v1/blogs?sort=${latestSort}&results=${limitItems}`);
  const getNewCodes = axios.get(`${process.env.NEXTAUTH_URL}/api/v1/codes?sort=${latestSort}&results=${limitItems}`);
  const getMostDownloadCodes = axios.get(
    `${process.env.NEXTAUTH_URL}/api/v1/codes?sort=${downloadSort}&results=${limitItems}`
  );
  const getMostViewCodes = axios.get(`${process.env.NEXTAUTH_URL}/api/v1/codes?sort=${viewSort}&results=${limitItems}`);
  const updateHomeView = System.findOneAndUpdate(
    {},
    { $inc: { home_views: 1 } },
    {
      new: true,
    }
  ).lean();
  const [newBlog, newCode, mostDownloadCode, mostViewCode, systemData] = await Promise.all([
    getNewBlogs,
    getNewCodes,
    getMostDownloadCodes,
    getMostViewCodes,
    updateHomeView,
  ]);

  return {
    props: {
      newCode: JSON.stringify(newCode.data.data),
      newBlog: JSON.stringify(newBlog.data.data),
      mostDownloadCode: JSON.stringify(mostDownloadCode.data.data),
      mostViewCode: JSON.stringify(mostViewCode.data.data),
      systemData: JSON.stringify(systemData),
    },
  };
};
