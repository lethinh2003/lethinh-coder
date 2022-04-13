import { Box, Button } from "@mui/material";
import Link from "next/link";
import Layout from "../../../components/admin/Layout";
import Blog from "../../../components/admin/panel/Blog";

const SourceCode = () => {
  return (
    <>
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: { xs: "40px 10px", md: "40px 20px" },
          }}
        >
          <Link href="/admin/blog/new">
            <Button variant="contained">Tạo mới</Button>
          </Link>
          <Blog />
        </Box>
      </Layout>
    </>
  );
};
export default SourceCode;
