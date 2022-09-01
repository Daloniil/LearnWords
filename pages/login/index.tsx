import { Box, Button } from "@mui/material";
import { getAuth } from "firebase/auth";
import Router from "next/router";
import { useEffect } from "react";
import { firebaseConfig } from "../../firebase-config";
import { useLogin } from "../../hooks/useLogin";
import { LoginStatus } from "../../services/localKey";

const LoginPage = () => {
  const { signIn, checkingLogin } = useLogin();
  const auth = getAuth(firebaseConfig);

  // const checkingLogin = () => {
  //   return setTimeout(() => {
  //     if (auth.currentUser) {
  //       Router.push("/enter");
  //     }
  //   }, 350);
  // };

  useEffect(() => {
    checkingLogin(LoginStatus.LOGIN);
  }, []);

  return (
    <Box>
      <Button onClick={signIn}>Authentication</Button>
    </Box>
  );
};

export default LoginPage;
