import Router from "next/router";
import { useEffect } from "react";

const ErrorPage = () => {
  useEffect(() => {
    Router.push("/login");
  }, []);
  return <></>;
};

export default ErrorPage;
