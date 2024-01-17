import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

const optionsPrice = [
  { label: "Giá giảm dần", key: "-costs" },
  { label: "Giá tăng dần", key: "costs" },
];
const optionsDate = [
  { label: "Mới nhất", key: "-createdAt" },
  { label: "Cũ nhất", key: "createdAt" },
];
const FilterCode = ({ setFilterValues, filterValues, setSearchQuery, searchQuery }) => {
  const [filterValuesSelected, setFilterValuesSelected] = useState({ ...filterValues });
  const [searchValuesSelected, setSearchValuesSelected] = useState(searchQuery);

  const handleChangeCost = (event) => {
    setFilterValuesSelected((prev) => ({ ...prev, costs: event.target.value }));
  };
  const handleChangeDate = (event) => {
    setFilterValuesSelected((prev) => ({ ...prev, date: event.target.value }));
  };
  const handleChangeSearchQuery = (event) => {
    setSearchValuesSelected(event.target.value);
  };
  const handleClickFilter = () => {
    setFilterValues((prev) => ({ ...prev, costs: filterValuesSelected.costs, date: filterValuesSelected.date }));
    setSearchQuery(searchValuesSelected);
  };

  return (
    <>
      <Box sx={{ p: 2, display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="costs">Giá</InputLabel>
          <Select labelId="costs" value={filterValuesSelected.costs} label="Giá" onChange={handleChangeCost}>
            {optionsPrice.map((item, i) => (
              <MenuItem key={i} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="date">Thời gian</InputLabel>
          <Select labelId="date" value={filterValuesSelected.date} label="Thời gian" onChange={handleChangeDate}>
            {optionsDate.map((item, i) => (
              <MenuItem key={i} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <TextField
            placeholder="Nhập từ khóa"
            label="Từ khóa"
            variant="outlined"
            value={searchValuesSelected}
            onChange={handleChangeSearchQuery}
          />
        </FormControl>
      </Box>

      <Button variant="contained" onClick={handleClickFilter}>
        Áp dụng
      </Button>
    </>
  );
};
export default FilterCode;
