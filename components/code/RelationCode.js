import { Button, Box, Typography, Card, CardActions, CardContent, CardMedia } from "@mui/material";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";

import NumberFormat from "react-number-format";

const RelationCode = (props) => {
  const { sourceCodeRelationship } = props;

  return (
    <>
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
        id="relation"
      >
        Code liên quan
      </Typography>
      <Box
        className="box-code_mobile"
        sx={{
          padding: { xs: "0 10px", md: "0 20px" },
          display: { xs: "block", md: "none" },
        }}
      >
        <div className="box-code_mobile__wrapper">
          {sourceCodeRelationship.length > 0 &&
            sourceCodeRelationship.map((item, i) => {
              return (
                <Card sx={{ minWidth: 300, overflow: "unset" }} key={i} className={`code-container`}>
                  <CardMedia
                    className="code-container__image"
                    component="img"
                    height="140"
                    image={item.images[0]}
                    alt={item.title}
                  />
                  <CardContent className="code-container__body">
                    <Typography
                      sx={{
                        fontFamily: "Noto Sans",
                        fontSize: "20px",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                      variant="h5"
                      component="div"
                    >
                      {item.title}
                    </Typography>
                    <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                      {item.desc}
                    </Typography>
                    <Typography sx={{ marginTop: "20px" }}>
                      {item.costs > 0 && (
                        <Button variant="contained" color="success">
                          <NumberFormat
                            value={item.costs}
                            displayType={"text"}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            suffix={" VNĐ"}
                          />{" "}
                        </Button>
                      )}
                      {item.costs === 0 && (
                        <Button variant="contained">
                          Free <MoneyOffIcon />
                        </Button>
                      )}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      paddingTop: "20px",
                      paddingLeft: "16px",
                    }}
                  >
                    <Link href={`/source-code/${item.slug}`}>
                      <Button size="small" variant="outlined" color="primary">
                        Chi tiết
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              );
            })}
        </div>
      </Box>
      <Box
        sx={{
          width: "100%",
          flexWrap: "wrap",
          bgcolor: "background.default",
          justifyContent: "space-between",
          color: "text.primary",
          gap: "10px",
          padding: "40px 20px",
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: { sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
        }}
      >
        {sourceCodeRelationship.length > 0 &&
          sourceCodeRelationship.map((item, i) => {
            return (
              <Card sx={{ minWidth: 300 }} key={i} className={`code-container`}>
                <CardMedia
                  className="code-container__image"
                  component="img"
                  height="140"
                  image={item.images[0]}
                  alt={item.title}
                />
                <CardContent className="code-container__body">
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans",
                      fontSize: "20px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                    variant="h5"
                    component="div"
                  >
                    {item.title}
                  </Typography>

                  <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                    {item.desc}
                  </Typography>
                  <Typography sx={{ marginTop: "20px" }}>
                    {item.costs > 0 && (
                      <Button variant="contained" color="success">
                        <NumberFormat
                          value={item.costs}
                          displayType={"text"}
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          suffix={" VNĐ"}
                        />
                      </Button>
                    )}
                    {item.costs === 0 && (
                      <Button variant="contained">
                        Free <MoneyOffIcon />
                      </Button>
                    )}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{
                    paddingTop: "20px",
                    paddingLeft: "16px",
                  }}
                >
                  <Link href={`/source-code/${item.slug}`}>
                    <Button size="small" variant="outlined" color="primary">
                      Chi tiết
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            );
          })}
      </Box>
    </>
  );
};
export default RelationCode;
