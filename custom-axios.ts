import axios from "axios";

export const axiosInstanceEn = axios.create({
  baseURL: process.env.API_URL,
});

export const axiosInstanceRu = axios.create({
  baseURL: process.env.API_URL,
});

axiosInstanceRu.interceptors.request.use(
  (config) => {
    (config.params = paramsToRu), (config.headers = headers);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceEn.interceptors.request.use(
  (config) => {
    (config.params = paramsToEn), (config.headers = headers);
    return config;
  },
  (error) => Promise.reject(error)
);

const paramsToRu = {
  to: "ru",
  "api-version": "3.0",
  profanityAction: "NoAction",
  textType: "plain",
};

const paramsToEn = {
  to: "en",
  "api-version": "3.0",
  profanityAction: "NoAction",
  textType: "plain",
};

const headers = {
  "content-type": "application/json",
  "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
  "X-RapidAPI-Key": "de7df71105msh595cc98825cd7ccp17ba88jsnf8d71fc903e6",
};
