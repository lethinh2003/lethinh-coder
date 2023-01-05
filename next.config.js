module.exports = {
  reactStrictMode: true,

  optimizeFonts: false,
  images: {
    domains: ["i.imgur.com", "anonyviet.com"],
  },
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    LIMIT_RESULTS: process.env.LIMIT_RESULTS,
    FACEBOOK_APPID: process.env.FACEBOOK_APPID,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    ENDPOINT_SERVER: process.env.ENDPOINT_SERVER,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ACCOUNT_GMAIL: process.env.ACCOUNT_GMAIL,
    PASSWORD_GMAIL: process.env.PASSWORD_GMAIL,
    EMAIL_FROM: process.env.EMAIL_FROM,
    MONGODB_URL: process.env.MONGODB_URL,
    OAUTH_CLIENTID: process.env.OAUTH_CLIENTID,
    OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN: process.env.OAUTH_REFRESH_TOKEN,
    SENDGRID_APIKEY: process.env.SENDGRID_APIKEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  },
};
