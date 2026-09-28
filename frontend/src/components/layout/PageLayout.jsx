import HeaderComponent from "./HeaderComponent";
import "./Layout.css";

export default function PageLayout({ children }) {
    return (
        <div className="page-shell">
            <HeaderComponent />

            <main className="page-content">
                {children}
            </main>
        </div>
    );
}