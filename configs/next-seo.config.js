const NextSeoConfig = {
  title: null,
  titleTemplate: "%s | LeThinh Blog",
  defaultTitle: "LeThinh Blog",
  description: "LeThinh Blog",
  additionalMetaTags: [
    {
      property: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXTAUTH_URL,
    siteName: "LeThinh Blog",
    description: "LeThinh Blog",
    images: [
      {
        url: "https://i.imgur.com/qDiL0xw.png",
        width: 1200,
        height: 628,
      },
    ],
  },
  facebook: {
    appId: process.env.FACEBOOK_APPID,
  },
  twitter: {
    handle: "@ThinhLe2013478",
    site: "@ThinhLe2013478",
    cardType: "summary_large_image",
  },
};
export default NextSeoConfig;
