import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";
import "./Layout.css";

export default function HeaderComponent() {
    const authContext = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        authContext.logout();
        navigate("/login");
    }

    function active(path) {
        return location.pathname.startsWith(path) ? "active" : "";
    }

    if (!authContext.isAuthenticated) {
        return null;
    }

    return (
        <header className="main-header">
            <div
                className="header-brand"
                onClick={() => navigate(`/welcome/${authContext.firstName}`)}
            >
                <div className="brand-logo">AI</div>

                <div>
                    <h2>Career Todo AI</h2>
                    <p>Student Career Management System</p>
                </div>
            </div>

            <nav className="header-nav">
                <Link
                    className={active("/welcome")}
                    to={`/welcome/${authContext.firstName}`}
                >
                    Home
                </Link>

                <Link
                    className={active("/todos")}
                    to="/todos"
                >
                    Manual Todo
                </Link>

                <Link
                    className={active("/career-analyzer")}
                    to="/career-analyzer"
                >
                    Resume Analyzer
                </Link>

                <Link
                    className={active("/career-history")}
                    to="/career-history"
                >
                    Analysis History
                </Link>
            </nav>

            <div className="header-user">
                <span>{authContext.username}</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
}