import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import { LoginStatus } from "../../services/localKey";

const LoginPage = () => {
  const { signIn, checkingLogin } = useLogin();

  useEffect(() => {
    checkingLogin(LoginStatus.LOGIN);
  }, []);

  return (
    <Box sx={{ margin: "0 auto 0 auto" }}>
      <Button onClick={signIn}>Authentication</Button>
    </Box>
  );
};

export default LoginPage;
