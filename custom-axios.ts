import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    (config.params = params), (config.headers = headers);
    return config;
  },
  (error) => Promise.reject(error)
);

const params = {
  to: "ru",
  "api-version": "3.0",
  profanityAction: "NoAction",
  textType: "plain",
};

const headers = {
  "content-type": "application/json",
  "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
  "X-RapidAPI-Key": "de7df71105msh595cc98825cd7ccp17ba88jsnf8d71fc903e6",
};
