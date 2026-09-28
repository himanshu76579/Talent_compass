import { useState, useEffect } from "react";
import "./LoginComponent.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";
import { createUserApi } from "../api/AuthApiService";

const LoginComponent = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [remember, setRemember] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);

    const [loginSuccess, setLoginSuccess] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const authContext = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginSuccess) {
            navigate(`/welcome/${authContext.firstName}`);
        }
    }, [loginSuccess, authContext.firstName, navigate]);

    function handleTabChange(isLogin) {
        setIsLoginActive(isLogin);
        setInvalidPassword(false);
        setUserCreated(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isLoginActive) {
            const success = await authContext.login(email, password);

            if (success) {
                setInvalidPassword(false);
                setLoginSuccess(true);
            } else {
                setInvalidPassword(true);
            }

            setUserCreated(false);
        } else {
            const user = {
                firstName,
                lastName,
                email,
                password
            };

            try {
                const response = await createUserApi(user);

                if (response.status === 200) {
                    setUserCreated(true);
                    setIsLoginActive(true);
                    setInvalidPassword(false);

                    setFirstName("");
                    setLastName("");
                    setPassword("");
                }
            } catch (error) {
                console.log(error);
                setUserCreated(false);
            }
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="brand-section">
                    <div className="logo">
                        <svg viewBox="0 0 24 24" fill="none" className="brand-icon">
                            <path
                                d="M12 2L2 7L12 12L22 7L12 2Z"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 17L12 22L22 17"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 12L12 17L22 12"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <h1 className="brand-name">Career Todo AI</h1>

                    <p className="brand-tagline">
                        Resume Analyzer + AI Todo Roadmap
                    </p>

                    <div className="decoration">
                        <div className="decoration-circle circle-1"></div>
                        <div className="decoration-circle circle-2"></div>
                        <div className="decoration-circle circle-3"></div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="tabs">
                        <button
                            type="button"
                            className={`tab ${isLoginActive ? "active" : ""}`}
                            onClick={() => handleTabChange(true)}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className={`tab ${!isLoginActive ? "active" : ""}`}
                            onClick={() => handleTabChange(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 className="welcome-text">
                        {isLoginActive ? "Welcome Back!" : "Create Account"}
                    </h2>

                    <p className="welcome-subtext">
                        {isLoginActive
                            ? userCreated
                                ? "User created successfully! Time to login."
                                : invalidPassword
                                    ? "Invalid username/password, Try again!"
                                    : "Login and continue your career preparation."
                            : "Create your account and start AI career planning."}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {!isLoginActive && (
                            <div className="input-group name-group">
                                <div className="name-input-container">
                                    <div className="first-name">
                                        <label htmlFor="first-name">First Name</label>

                                        <div className="input-with-icon">
                                            <span className="input-icon">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="icon"
                                                >
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </span>

                                            <input
                                                type="text"
                                                id="first-name"
                                                placeholder="Nagmani"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required={!isLoginActive}
                                            />
                                        </div>
                                    </div>

                                    <div className="last-name">
                                        <label htmlFor="last-name">Last Name</label>

                                        <div className="input-with-icon">
                                            <span className="input-icon">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="icon"
                                                >
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </span>

                                            <input
                                                type="text"
                                                id="last-name"
                                                placeholder="Kumar"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required={!isLoginActive}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email</label>

                            <div className="input-with-icon">
                                <span className="input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        className="icon"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </span>

                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>

                            <div className="input-with-icon">
                                <span className="input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        className="icon"
                                    >
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>

                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {isLoginActive && (
                            <div className="form-options">
                                <div className="remember-me">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                    />

                                    <label htmlFor="remember">Remember me</label>
                                </div>

                                <a href="#" className="forgot-password">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button type="submit" className="submit-btn">
                            {isLoginActive ? "Login" : "Create Account"}
                        </button>
                    </form>

                    <div className="divider">
                        <span>Career Todo AI</span>
                    </div>

                    <div className="toggle-text">
                        {isLoginActive ? (
                            <p>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="text-btn"
                                    onClick={() => handleTabChange(false)}
                                >
                                    Sign up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-btn"
                                    onClick={() => handleTabChange(true)}
                                >
                                    Login
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;