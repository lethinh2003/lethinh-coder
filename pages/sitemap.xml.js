import axios from "axios";
import dayjs from "dayjs";
import _ from "lodash";

const SiteMap = () => {};

const LINK_WEBSITE = process.env.NEXTAUTH_URL;
const DANH_MUC = [
  {
    title: "Home",
    link: `${LINK_WEBSITE}/`,
    priority: "1.00",
  },
  {
    title: "Source",
    link: `${LINK_WEBSITE}/source-code`,
    priority: "0.80",
  },
  {
    title: "Blog",
    link: `${LINK_WEBSITE}/blog`,
    priority: "0.80",
  },
];

const generateSiteMap = ({ blogs, codes, blogLabels, codeLabels }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${DANH_MUC.map(({ link, priority }) => {
         return `
        <url>
            <loc>${`${link}`}</loc>
            <changefreq>daily</changefreq>
            <priority>${`${priority}`}</priority>
        </url>
      `;
       }).join("")}


       ${blogLabels
         .map((label) => {
           return `
         <url>
             <loc>${`${LINK_WEBSITE}/blog/label/${encodeURIComponent(label)}`}</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
         </url>
       `;
         })
         .join("")}
       ${codeLabels
         .map((label) => {
           return `
         <url>
             <loc>${`${LINK_WEBSITE}/source-code/label/${encodeURIComponent(label)}`}</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
         </url>
       `;
         })
         .join("")}
       ${blogs
         .map(({ slug, updatedAt }) => {
           return `
         <url>
             <loc>${`${LINK_WEBSITE}/blog/${slug}`}</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
             <lastmod>${dayjs(updatedAt).format("YYYY-MM-DD")}</lastmod>

         </url>
       `;
         })
         .join("")}
       ${codes
         .map(({ slug, updatedAt }) => {
           return `
         <url>
             <loc>${`${LINK_WEBSITE}/source-code/${slug}`}</loc>
             <changefreq>daily</changefreq>
             <priority>0.8</priority>
             <lastmod>${dayjs(updatedAt).format("YYYY-MM-DD")}</lastmod>

         </url>
       `;
         })
         .join("")}
     </urlset>
   `;
};

export async function getServerSideProps({ res }) {
  const [getNewBlogs, getNewSourceCodes] = await Promise.all([
    axios.get(`${process.env.NEXTAUTH_URL}/api/v1/blogs?results=1000000`),
    axios.get(`${process.env.NEXTAUTH_URL}/api/v1/codes?results=1000000`),
  ]);

  const getListBlogLabels = _.uniq(_.flattenDeep(getNewBlogs.data?.data?.map(({ labels }) => labels) ?? []));
  const getListCodeLabels = _.uniq(_.flattenDeep(getNewSourceCodes.data?.data?.map(({ labels }) => labels) ?? []));
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap({
    blogs: getNewBlogs.data.data,
    codes: getNewSourceCodes.data.data,
    blogLabels: getListBlogLabels,
    codeLabels: getListCodeLabels,
  });

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
export default SiteMap;
