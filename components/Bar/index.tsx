import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { BarProps } from "../../Interfaces/BarInterface";
import { useAuth } from "../../hooks/useAuth";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
}));

export const Bar = ({ title, setOpen }: BarProps) => {
  const { authContext } = useAuth();

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, gap: 1 }}>
        {authContext.user?.uid ? (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open menu"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            <MenuIcon />
          </IconButton>
        ) : null}

        <TranslateOutlinedIcon sx={{ display: { xs: "none", sm: "block" } }} />

        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, fontWeight: 700 }}
        >
          {title || "LearnWords"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
