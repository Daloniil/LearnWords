import Router from "next/router";
import { useEffect } from "react";

const ErrorPage = () => {
  useEffect(() => {
    Router.push("/enter");
  }, []);
  return <></>;
};

export default ErrorPage;
