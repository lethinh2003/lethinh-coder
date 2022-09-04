import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Activities from "./Activities";
import Notifies from "./Notifies";
import { memo } from "react";
import { useSession } from "next-auth/react";

const DetailAccount = ({ user, socket }) => {
  const [value, setValue] = useState("0");
  const { data: session, status } = useSession();
  useEffect(() => {
    setValue("0");
  }, [user]);

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: "none",
    fontWeight: "600",
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: theme.palette.iconColor.default,
    "&.Mui-selected": {
      color: theme.palette.mode === "dark" ? "#fff" : "black",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#20262d" : "#eaebec",
      borderRadius: "20px",
    },
  }));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const TabMenu = [
    {
      label: "Activities",
      value: "0",
      type: 0,
    },
    {
      label: "Notifications",
      value: "1",
      type: 1,
    },
  ];
  return (
    <>
      {user && (
        <Box
          sx={{
            width: "100%",
            padding: { xs: "0 10px", md: "0 20px" },
            gap: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: { xs: "column", md: "column" },
            flexWrap: "wrap",
            borderBottom: (theme) => (theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e"),
          }}
        >
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              sx={{
                width: "100%",

                borderBottom: (theme) => (theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e"),
              }}
            >
              {TabMenu.map((item, i) => {
                if (item.type === 1) {
                  if (session && session.user && session.user.account === user.account) {
                    return <StyledTab key={item.value} label={item.label} value={item.value} />;
                  }
                } else {
                  return <StyledTab key={item.value} label={item.label} value={item.value} />;
                }
              })}
            </TabList>

            <TabPanel
              sx={{
                padding: 0,
                width: "100%",
              }}
              value="0"
            >
              <Activities user={user} socket={socket} />
            </TabPanel>

            <TabPanel
              sx={{
                padding: 0,
                width: "100%",
              }}
              value="1"
            >
              <Notifies user={user} socket={socket} />
            </TabPanel>
            <TabPanel
              sx={{
                padding: 0,
                width: "100%",
              }}
              value="2"
            >
              <Notifies user={user} socket={socket} />
            </TabPanel>
          </TabContext>
        </Box>
      )}
    </>
  );
};
export default memo(DetailAccount);
