import React, { useContext, useState } from "react";
import { authenticateUserApi } from "../api/AuthApiService";

export const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );

    const [firstName, setFirstName] = useState(
        localStorage.getItem("firstName")
    );

    const [username, setUsername] = useState(
        localStorage.getItem("username")
    );

    async function login(email, password) {
        try {
            const response = await authenticateUserApi({
                email,
                password
            });

            if (response.status === 200) {
                const jwtToken = "Bearer " + response.data[0];
                const userFirstName = response.data[1];

                setIsAuthenticated(true);
                setFirstName(userFirstName);
                setUsername(email);

                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("token", jwtToken);
                localStorage.setItem("firstName", userFirstName);
                localStorage.setItem("username", email);

                return true;
            }

            logout();
            return false;
        } catch (error) {
            logout();
            return false;
        }
    }

    function logout() {
        setIsAuthenticated(false);
        setFirstName(null);
        setUsername(null);

        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        localStorage.removeItem("username");
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                firstName,
                username,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}