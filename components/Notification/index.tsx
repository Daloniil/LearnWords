import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotification } from "../../hooks/useNotification";
import { NotificationKeys } from "../../services/localKey";
import { notificationTranslation } from "../../translation/Notification";
import { setTranslation } from "../../utils/setTranslation";

export const Notification = () => {
  const { notification, statusNotification, removeNotification } =
    useNotification();
  const { languageContext } = useLanguage();

  const translation = (key: string) => {
    return setTranslation(key, notificationTranslation, languageContext);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={!!notification}
      onClose={removeNotification}
      sx={{ width: "300px", margin: "0 auto 0 auto" }}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={
          statusNotification === NotificationKeys.SUCCESS
            ? NotificationKeys.SUCCESS
            : NotificationKeys.ERROR
        }
      >
        {translation(notification ?? "") && translation(notification ?? "")}
      </Alert>
    </Snackbar>
  );
};
