import { Box, Button, Card, IconButton, Skeleton, Typography } from "@mui/material";
import { AiFillFileZip, AiOutlineCheck, AiOutlineUser } from "react-icons/ai";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";
import { MdPendingActions } from "react-icons/md";
import { NumericFormat } from "react-number-format";

import useGetOverview from "../../../hooks/admin/useGetOverview";
const Overview = () => {
  const { data, isLoading, isFetching, isError: isErrorQuery, error } = useGetOverview();

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
    } else if (type === "blogs") {
      return <BsJournalBookmarkFill />;
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
                <NumericFormat value={item.value} displayType={"text"} thousandSeparator={"."} decimalSeparator={","} />
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
