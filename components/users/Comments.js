import { Box, ListItem, ListItemAvatar, ListItemText, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loading-icons";
import { useInfiniteQuery } from "react-query";
import CommentContent from "./CommentContent";
const Comments = ({ user, socket }) => {
  const hostServer = process.env.ENDPOINT_SERVER;

  const [dataCommentLength, setDataCommentLength] = useState(0);

  const [limitResults, setLimitResults] = useState(process.env.LIMIT_RESULTS * 1 || 10);

  const callDataApi = async (userID, pageParam) => {
    if (!userID) {
      return null;
    }
    const results = await axios.get(
      `${hostServer}/api/v1/comments?accountID=${userID}&page=${pageParam}&results=${limitResults}`
    );
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
  } = useInfiniteQuery(
    ["get-comments-detail-user", user.account],
    ({ pageParam = 1 }) => callDataApi(user._id, pageParam),
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      getNextPageParam: (_lastPage, pages) => {
        if (pages[pages.length - 1].results === limitResults) {
          return pages.length + 1;
        }
        return undefined;
      },
    }
  );
  useEffect(() => {
    if (dataQuery) {
      const dataLength = dataQuery.pages.reduce(
        (a, b) => {
          return { results: a.results + b.results };
        },
        { results: 0 }
      );
      setDataCommentLength(dataLength.results);
    }
  }, [dataQuery]);
  const ActivitiesTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });

  return (
    <>
      <ActivitiesTitle>Bình luận</ActivitiesTitle>

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
          dataLength={dataCommentLength}
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
          style={{
            marginBottom: "10px",
          }}
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
                Danh sách trống
              </Typography>
            )}
            {!isLoading &&
              dataQuery?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((item) => {
                    return (
                      <CommentContent
                        refetch={refetch}
                        key={item._id}
                        newContent={item.content}
                        item={item}
                        socket={socket}
                        user={user}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
          </Box>
        </InfiniteScroll>
      </Box>
    </>
  );
};
export default Comments;
