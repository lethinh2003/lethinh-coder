module.exports = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ACCOUNT_GMAIL: process.env.ACCOUNT_GMAIL,
    PASSWORD_GMAIL: process.env.PASSWORD_GMAIL,
    EMAIL_FROM: process.env.EMAIL_FROM,
    MONGODB_URL: process.env.MONGODB_URL,
    OAUTH_CLIENTID: process.env.OAUTH_CLIENTID,
    OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN: process.env.OAUTH_REFRESH_TOKEN,
    SENDGRID_APIKEY: process.env.SENDGRID_APIKEY,
  },
};
