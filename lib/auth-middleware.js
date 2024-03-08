import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { UnauthorizedError } from "../utils/appError";

export default function authMiddleware(handle, role) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      throw new UnauthorizedError("Vui lòng đăng nhập");
    }
    if (session?.user?.role !== role || false) {
      throw new UnauthorizedError("Không đủ quyền truy cập");
    }
    return handle(req, res);
  };
}
export function protectedMiddleware(handle) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      throw new UnauthorizedError("Vui lòng đăng nhập");
    }
    return handle(req, res);
  };
}
