import { Box, Button, Typography, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import axios from "axios";

const FilterCode = (props) => {
  const { setIsLoading, setSourceCode } = props;
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");

  const optionsPrice = [
    { label: "Giá giảm dần", key: "-costs" },
    { label: "Giá tăng dần", key: "costs" },
  ];
  const optionsLabels = [
    { label: "PHP", key: "php" },
    { label: "REACTJS", key: "reactjs" },
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
  const handleChangeLabels = (event) => {
    setLabel(event.target.value);
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
      const result = await axios.get(`/api/source-code?sort=${newArraySort}&label=${label.toLowerCase()}`);
      setSourceCode(result.data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <Box sx={{ p: 2, display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <FormControl sx={{ width: 300 }}>
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
        <FormControl sx={{ width: 300 }}>
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
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="labels">Labels</InputLabel>
          <Select labelId="labels" value={label} label="Labels" onChange={handleChangeLabels}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {optionsLabels.map((item, i) => (
              <MenuItem key={i} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Button variant="contained" onClick={handleClickFilter}>
        Lọc
      </Button>
    </>
  );
};
export default FilterCode;
