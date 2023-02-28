import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        (config.headers = headers);
        return config;
    },
    (error) => Promise.reject(error)
);

const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': '46d5fb6f9bmshf27fba677158125p1465e3jsn767663ab393d',
    'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
}
