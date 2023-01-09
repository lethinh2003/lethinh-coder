import { Box, ListItem, ListItemAvatar, ListItemText, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loading-icons";
import { useInfiniteQuery } from "react-query";
import NotifyContent from "../../components/notify/NotifyContent";
const Notifies = ({ user, socket }) => {
  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();
  const [dataNotifyLength, setDataNotifyLength] = useState(0);
  const [limitResults, setLimitResults] = useState(process.env.LIMIT_RESULTS * 1 || 10);
  const callDataApi = async (pageParam) => {
    const results = await axios.get(`${hostServer}/api/v1/notifies?page=${pageParam}&results=${limitResults}`);
    socket.emit("read-notify", user._id);
    return results.data;
  };

  const {
    data: dataQuery,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery(["get-notifies-user"], ({ pageParam = 1 }) => callDataApi(pageParam), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    getNextPageParam: (_lastPage, pages) => {
      if (pages[pages.length - 1].results === limitResults) {
        return pages.length + 1;
      }
      return undefined;
    },
  });
  useEffect(() => {
    if (dataQuery) {
      const dataLength = dataQuery.pages.reduce(
        (a, b) => {
          return { results: a.results + b.results };
        },
        { results: 0 }
      );
      setDataNotifyLength(dataLength.results);
    }
  }, [dataQuery]);

  return (
    <>
      <Head>
        <title>Thông báo tài khoản {user.account}</title>
      </Head>
      <Box
        sx={{
          paddingTop: "16px",
        }}
      >
        {isErrorQuery && (
          <Typography
            sx={{
              color: "#ea5e5e",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Error: {error && error.response ? `${error.response.data.message}` : "Something went wrong"}
          </Typography>
        )}
        <InfiniteScroll
          dataLength={dataNotifyLength}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ThreeDots fill="#06bcee" width={30} height={30} />
            </Box>
          }
          height={400}
          endMessage={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  marginTop: "10px",
                  backgroundColor: "#374151",
                  padding: "15px",
                  borderRadius: "10px",
                  fontSize: "1.5rem",
                  color: "#ffffff",
                }}
              >
                Đã hết danh sách 👏🏼
              </Box>
            </Box>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {isLoading &&
              Array.from({ length: 4 }).map((item, i) => (
                <ListItem
                  button={true}
                  key={i}
                  sx={{
                    width: "100%",
                  }}
                >
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Skeleton variant="text" height={70} />
                    <Skeleton variant="text" width={100} />
                  </ListItemText>
                </ListItem>
              ))}

            {!isLoading && dataQuery?.pages[0].results === 0 && (
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Thông báo trống
              </Typography>
            )}
            {!isLoading &&
              dataQuery?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((item) => {
                    let newContent = item.content;
                    const content = item.content;
                    if (content.includes("{name}")) {
                      newContent = newContent.replace("{name}", item.account_send[0].name);
                    }
                    return <NotifyContent refetch={refetch} key={item._id} newContent={newContent} item={item} />;
                  })}
                </React.Fragment>
              ))}
          </Box>
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default Notifies;
