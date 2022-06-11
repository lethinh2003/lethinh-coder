import { Box, Button, Card, IconButton, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillFileZip, AiOutlineCheck, AiOutlineUser } from "react-icons/ai";
import { HiTemplate } from "react-icons/hi";
import { MdPendingActions } from "react-icons/md";
import NumberFormat from "react-number-format";
import { useQuery } from "react-query";

import { toast } from "react-toastify";
const Overview = ({ status }) => {
  const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const callDataApi = async () => {
    const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/admin/overview`);

    return results.data;
  };
  const getListQuery = useQuery("get-admin-overview", callDataApi, {
    cacheTime: Infinity, //Thời gian cache data, ví dụ: 5000, sau 5s thì cache sẽ bị xóa, khi đó data trong cache sẽ là undefined
    refetchOnWindowFocus: false,
  });
  const { data: dataQuery, isLoading, isFetching, isError: isErrorQuery, error } = getListQuery;
  useEffect(() => {
    if (error && error.response) {
      toast.error(error.response.data.message);
    }
  }, [isErrorQuery]);
  useEffect(() => {
    if (dataQuery) {
      setData(dataQuery.data);
    }
  }, [dataQuery]);
  useEffect(() => {
    const getOverview = async () => {
      try {
        setIsLoading(true);
        const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/admin/overview`);
        setData(results.data.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    };
    if (status === "authenticated") {
      // getOverview();
    }
  }, [status]);
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
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
      >
        OVERVIEW
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0,1fr))",

            md: "repeat(2, minmax(0,1fr))",

            lg: "repeat(4, minmax(0,1fr))",
          },
          gap: "20px",
        }}
      >
        {isLoading &&
          Array.from({ length: 5 }).map((item, i) => (
            <Card
              sx={{
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
                  sx={{ textTransform: "capitalize", fontFamily: "Noto Sans", fontSize: "20px", fontWeight: "bold" }}
                >
                  {item.title}
                </Typography>
              </Typography>
              <Typography component="div" sx={{ fontFamily: "Noto Sans", fontSize: "40px", fontWeight: "bold" }}>
                <NumberFormat value={item.value} displayType={"text"} thousandSeparator={"."} decimalSeparator={","} />
              </Typography>

              <Button variant="outlined" sx={{ fontFamily: "Noto Sans", fontSize: "20px", fontWeight: "bold" }}>
                Chi tiết
              </Button>
            </Card>
          ))}
      </Box>
    </>
  );
};
export default Overview;
