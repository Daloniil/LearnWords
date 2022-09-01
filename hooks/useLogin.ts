import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Router from "next/router";
import { authentication, firebaseConfig } from "../firebase-config";
import { LoginStatus, NotificationKeys } from "../services/localKey";
import { useNotification } from "./useNotification";

export const useLogin = () => {
  const { addNotification } = useNotification();
  const auth = getAuth(firebaseConfig);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(authentication, provider).then((res) => {
      if (res) {
        Router.push("/enter");
      } else {
        addNotification("Error", NotificationKeys.ERROR);
      }
    });
  };

  const checkingLogin = (status: string) => {
    return setTimeout(() => {
      if (!auth.currentUser && status === LoginStatus.OTHER) {
        Router.push("/login");
      } else if (auth.currentUser && status === LoginStatus.LOGIN) {
        Router.push("/enter");
      }
    }, 350);
  };

  const signOutGoogle = () => {
    signOut(auth);
    Router.push("/login");
  };

  return {
    signIn,
    signOutGoogle,
    checkingLogin,
  };
};
