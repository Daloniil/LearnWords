import { useContext } from "react";
import { NotificationContext } from "../providers/NotificationProvider";

export const useNotification = () => {
  const {
    notification,
    statusNotification,
    addNotification,
    removeNotification,
  } = useContext(NotificationContext);

  return {
    notification,
    statusNotification,
    addNotification,
    removeNotification,
  };
};
