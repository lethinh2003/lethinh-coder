import { Box, Typography } from "@mui/material";
import { kv } from "@vercel/kv";
import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../../../components/admin/Layout";
import SystemForm from "../../../components/admin/panel/SystemForm";
import { KEY_SYSTEM } from "../../../configs/keyRedis";
import RedisService from "../../../services/client/RedisService";
export default function MyEditor() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getSystemData = async () => {
      try {
        const systemData = await RedisService.getDataSystem();
        setData(systemData);
      } catch (err) {
        console.log(err);
      }
    };
    getSystemData();
  }, []);

  const handleEdit = async (formData) => {
    try {
      const {
        myself_name,
        myself_desc,
        myself_avatar,
        myself_fb,
        myself_zalo,
        myself_instagram,
        myself_email,
        home_logo,
        meta_title,
        meta_keywords,
        meta_desc,
        meta_author,
        meta_thumbnail,
        myself_fb_name,
        myself_zalo_name,
        home_introduce,
      } = formData;
      const newDataSystem = {
        ...data,
        myself_name,
        myself_desc,
        myself_avatar,
        myself_fb,
        myself_zalo,
        myself_instagram,
        myself_email,
        home_logo,
        meta_title,
        meta_keywords,
        meta_desc,
        meta_author,
        meta_thumbnail,
        myself_fb_name,
        myself_zalo_name,
        home_introduce,
      };
      await kv.set(KEY_SYSTEM, JSON.stringify(newDataSystem));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Head>
        <title>Setting - Trang quản trị Admin</title>
      </Head>
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
            padding: "40px 20px",
          }}
        >
          <Typography
            component="h1"
            className="title"
            sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
          >
            Setting
          </Typography>
        </Box>
        {data && <SystemForm initData={data} handleSubmitForm={handleEdit} />}
      </Layout>
    </>
  );
}
