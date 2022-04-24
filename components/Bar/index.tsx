import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { BarProps } from "../../Interfaces/BarInterface";

export const Bar = ({ title, setOpen }: BarProps) => {
  const drawerWidth: number = 240;

  const AppBar = styled(MuiAppBar)(({ theme }) => ({
    zIndex: 1,
    marginLeft: drawerWidth,
    width: `100%`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#32cd32",
  }));

  return (
    <AppBar position="absolute">
      <Toolbar>
        <IconButton
          edge="start"
          aria-label="open drawer"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        <IconButton color="inherit">
          <Typography variant="h6" color="inherit" component="div">
            Word learning
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
