import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { QueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { setFilterValueSourceCode } from "../../redux/actions/filterValueSourceCode";

const FilterCode = (props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: Infinity,
      },
    },
  });
  const { cost: costParent, date: dateParent, isLoading, isFetching } = props;
  const [cost, setCost] = useState(costParent);
  const [date, setDate] = useState(dateParent);

  const optionsPrice = [
    { label: "Giá giảm dần", key: "-costs" },
    { label: "Giá tăng dần", key: "costs" },
  ];
  const optionsDate = [
    { label: "Mới nhất", key: "-createdAt" },
    { label: "Cũ nhất", key: "createdAt" },
  ];
  const dispatch = useDispatch();

  const handleChangeCost = (event) => {
    setCost(event.target.value);
  };
  const handleChangeDate = (event) => {
    setDate(event.target.value);
  };
  const handleClickFilter = () => {
    dispatch(setFilterValueSourceCode({ costs: cost, date }));
  };

  return (
    <>
      <Box sx={{ p: 2, display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <FormControl sx={{ width: 300 }} disabled={isFetching ? true : false}>
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
        <FormControl sx={{ width: 300 }} disabled={isFetching ? true : false}>
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
          opacity: isFetching ? 0.6 : 1,
          pointerEvents: isFetching ? "none" : "auto",
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
