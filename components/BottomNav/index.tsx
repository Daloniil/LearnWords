import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  {
    path: "/enter",
    en: "Add",
    ru: "Добавить",
    icon: AddCircleOutlineIcon,
  },
  {
    path: "/dictionary",
    en: "Dictionary",
    ru: "Словарь",
    icon: MenuBookOutlinedIcon,
  },
  {
    path: "/test",
    en: "Test",
    ru: "Тест",
    icon: QuizOutlinedIcon,
  },
  {
    path: "/folders",
    en: "Folders",
    ru: "Папки",
    icon: FolderOutlinedIcon,
  },
  {
    path: "/settings",
    en: "Settings",
    ru: "Настройки",
    icon: SettingsOutlinedIcon,
  },
];

const hiddenRoutes = ["/login", "/metro"];

export const BottomNav = () => {
  const router = useRouter();
  const { languageContext } = useLanguage();
  const { authContext } = useAuth();

  if (!authContext.user?.uid || hiddenRoutes.includes(router.pathname)) {
    return null;
  }

  const currentIndex = navItems.findIndex((item) =>
    router.pathname.startsWith(item.path)
  );

  useEffect(() => {
    navItems.forEach((item) => {
      router.prefetch(item.path);
    });
  }, [router]);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        pb: "env(safe-area-inset-bottom)",
        display: { xs: "block", md: "none" },
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={currentIndex === -1 ? false : currentIndex}
        onChange={(_, index) => router.push(navItems[index].path)}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={languageContext === "english" ? item.en : item.ru}
            icon={<item.icon />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
