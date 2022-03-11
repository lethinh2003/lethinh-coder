import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Skeleton,
  ListItemAvatar,
  ListItem,
  ListItemText,
} from "@mui/material";
import convertTime from "../../utils/convertTime";
import axios from "axios";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ReactPaginate from "react-paginate";
const Items = ({ currentItems, isLoading }) => {
  return (
    <>
      {isLoading &&
        Array.from({ length: 4 }).map((item, i) => (
          <ListItem button={true} key={i}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" />
            </ListItemText>
          </ListItem>
        ))}
      {!isLoading &&
        currentItems &&
        currentItems.length > 0 &&
        currentItems.map((item, i) => (
          <ListItem button={true} key={i}>
            <ListItemAvatar>
              <Avatar alt={item.account_send[0].account}>{item.account_send[0].account.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.account_send[0].account} secondary={item.content}></ListItemText>
          </ListItem>
        ))}
    </>
  );
};
const Notifies = (props) => {
  const { data, isLoading } = props;
  console.log(data);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <h1 className="title">Thông báo</h1>

      <Box
        sx={{
          width: "100%",

          gap: "20px",
          display: "flex",

          flexDirection: "column",
        }}
      >
        <Items currentItems={currentItems} isLoading={isLoading} />
        <Box>
          <ReactPaginate
            containerClassName="pagination"
            pageLinkClassName="button"
            activeLinkClassName="active"
            previousLinkClassName="button"
            nextLinkClassName="button"
            breakLabel="..."
            nextLabel={<NavigateNextIcon />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={<NavigateBeforeIcon />}
            renderOnZeroPageCount={null}
          />
        </Box>
      </Box>
    </>
  );
};
export default Notifies;
