import { apiCLient } from "./apiClient";

export const authenticateUserApi = (loginRequest) =>
    apiCLient.post("/authenticate", loginRequest);

export const createUserApi = (user) =>
    apiCLient.post("/user", user);