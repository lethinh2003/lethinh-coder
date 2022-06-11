import { Box, Button, Typography, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import axios from "axios";

const FilterCode = (props) => {
  const {
    itemsPerPage,
    setIsLoading,
    setSourceCode,
    cost,
    setCost,
    date,
    setDate,
    isLoading,
    countPage,
    setIsLoadMore,
    setIsEndLoadingMore,
  } = props;

  const optionsPrice = [
    { label: "Giá giảm dần", key: "-costs" },
    { label: "Giá tăng dần", key: "costs" },
  ];
  const optionsDate = [
    { label: "Mới nhất", key: "-createdAt" },
    { label: "Cũ nhất", key: "createdAt" },
  ];

  const handleChangeCost = (event) => {
    setCost(event.target.value);
  };
  const handleChangeDate = (event) => {
    setDate(event.target.value);
  };
  const handleClickFilter = async () => {
    const arraySort = [];
    if (cost) {
      arraySort.push(cost);
    }
    if (date) {
      arraySort.push(date);
    }

    const newArraySort = arraySort.join(",");
    try {
      setIsLoading(true);
      setIsEndLoadingMore(false);
      countPage.current = 1;
      const results = await axios.get(
        `${process.env.ENDPOINT_SERVER}/api/v1/source-codes?sort=${newArraySort}&page=${countPage.current}&results=${itemsPerPage}`
      );
      if (results.data.results === itemsPerPage) {
        setIsLoadMore(true);
        countPage.current = countPage.current + 1;
      } else {
        setIsLoadMore(false);
      }
      setSourceCode(results.data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <Box sx={{ p: 2, display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <FormControl sx={{ width: 300 }} disabled={isLoading ? true : false}>
          <InputLabel id="costs">Giá</InputLabel>
          <Select labelId="costs" value={cost} label="Giá" onChange={handleChangeCost}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {optionsPrice.map((item, i) => (
              <MenuItem key={i} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 300 }} disabled={isLoading ? true : false}>
          <InputLabel id="date">Thời gian</InputLabel>
          <Select labelId="date" value={date} label="Thời gian" onChange={handleChangeDate}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {optionsDate.map((item, i) => (
              <MenuItem key={i} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Button
        sx={{
          opacity: isLoading ? 0.6 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
        variant="contained"
        onClick={handleClickFilter}
      >
        Lọc
      </Button>
    </>
  );
};
export default FilterCode;
