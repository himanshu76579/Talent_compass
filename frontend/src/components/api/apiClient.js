import axios from "axios";

export const apiCLient = axios.create({
    baseURL: "http://localhost:8080"
});

apiCLient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = token;
    }

    return config;
});