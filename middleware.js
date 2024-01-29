import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ token }) => {
      if (!token) {
        return false;
      }
      return token?.role === "admin" || false;
    },
  },
});
export const config = { matcher: ["/admin/:path*"] };
