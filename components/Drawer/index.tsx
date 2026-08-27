import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { paths } from "../../utils/path";
import { useRouter } from "next/router";
import Router from "next/router";
import { DrawerBarProps } from "../../Interfaces/DrawerBarInterface";
import { useLanguage } from "../../hooks/useLanguage";

export const DrawerBar = ({ openDrawer, setOpenDrawer }: DrawerBarProps) => {
  const { languageContext } = useLanguage();
  const [drawerStatus, setDrawerStatus] = useState(false);
  const router = useRouter();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerStatus(open);
      setOpenDrawer(false);
    };

  useEffect(() => {
    if (openDrawer) setDrawerStatus(openDrawer);
  }, [openDrawer]);

  return (
    <Drawer anchor="left" open={drawerStatus} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 280 }} role="presentation">
        <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 1 }}>
          <IconButton onClick={toggleDrawer(false)} aria-label="close menu">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
        </Box>
        <Divider />
        <List sx={{ py: 1 }}>
          {paths.map((item) => (
            <ListItemButton
              key={item.pathName}
              selected={item.pathName === router.asPath}
              onClick={() => Router.push(item.pathName)}
              sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText
                primary={languageContext === "english" ? item.en : item.ru}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
