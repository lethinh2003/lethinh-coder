import { Box, Button, Card, IconButton, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillFileZip, AiOutlineCheck, AiOutlineUser } from "react-icons/ai";
import { HiTemplate } from "react-icons/hi";
import { MdPendingActions } from "react-icons/md";
import { NumericFormat } from "react-number-format";
import Layout from "../../../components/admin/Layout";
const Tools = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getHistoryCode = async () => {
      try {
        const results = await axios.get("/api/admin/tools");
        setData(results.data.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };

    getHistoryCode();
  }, []);
  const displayIcon = (type) => {
    if (type === "orders") {
      return <HiTemplate />;
    } else if (type === "ordersSuccess") {
      return <AiOutlineCheck />;
    } else if (type === "ordersPending") {
      return <MdPendingActions />;
    } else if (type === "sourcesCode") {
      return <AiFillFileZip />;
    } else if (type === "users") {
      return <AiOutlineUser />;
    }
  };
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
          <Typography
            component="h1"
            className="title"
            sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
          >
            Tools
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {isLoading &&
              Array.from({ length: 5 }).map((item, i) => (
                <Card
                  sx={{
                    width: "220px",
                    height: "220px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  key={i}
                >
                  <Skeleton width={"150px"} height={50} />
                  <Skeleton width={"50px"} height={50} />
                  <Skeleton variant="rectangular" width={"100px"} height={50} />
                </Card>
              ))}
            {!isLoading &&
              data.length > 0 &&
              data.map((item, i) => (
                <Card
                  key={i}
                  sx={{
                    width: "220px",
                    height: "220px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      component="div"
                      sx={{
                        width: "60px",
                        height: "60px",

                        padding: "5px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {displayIcon(item.key)}
                    </IconButton>
                    <Typography
                      component="span"
                      sx={{
                        textTransform: "capitalize",
                        fontFamily: "Noto Sans",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Typography>
                  <Typography component="div" sx={{ fontFamily: "Noto Sans", fontSize: "40px", fontWeight: "bold" }}>
                    <NumericFormat
                      value={item.value}
                      displayType={"text"}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                    />
                  </Typography>

                  <Button variant="outlined" sx={{ fontFamily: "Noto Sans", fontSize: "20px", fontWeight: "bold" }}>
                    Chi tiết
                  </Button>
                </Card>
              ))}
          </Box>
        </Box>
      </Layout>
    </>
  );
};
export default Tools;
