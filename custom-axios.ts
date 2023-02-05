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
    'X-RapidAPI-Key': '2f496b6999msh6ff42ab71dd9d09p1a0bd4jsn9bd1ce307e4d',
    'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
}
