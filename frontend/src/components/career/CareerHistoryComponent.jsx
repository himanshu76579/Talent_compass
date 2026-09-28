import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "../security/AuthContext";
import { getCareerHistoryApi } from "../api/CareerApiService";
import "./Career.css";

export default function CareerHistoryComponent() {
    const authContext = useAuth();
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        try {
            setLoading(true);
            setError("");

            const response = await getCareerHistoryApi(authContext.username);
            setHistory(response.data || []);
        } catch (error) {
            setError("Failed to load analysis history.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageLayout>
            <div className="career-page">
                <section className="career-hero history-hero">
                    <div>
                        <span>Saved Resume Reports</span>

                        <h1>Analysis History</h1>

                        <p>
                            Open old resume analysis, check ATS score, view saved AI todos,
                            and continue resume chatbot with same conversationId.
                        </p>
                    </div>
                </section>

                {error && <div className="career-error">{error}</div>}

                {loading && (
                    <div className="career-panel">
                        <h2>Loading history...</h2>
                    </div>
                )}

                {!loading && history.length === 0 && (
                    <div className="career-panel empty-result">
                        <h2>No analysis found</h2>
                        <p>Run resume analyzer first to create your first report.</p>
                    </div>
                )}

                <div className="history-grid">
                    {history.map(item => (
                        <div className="history-card" key={item.id}>
                            <div className="history-top">
                                <span>ATS {item.atsScore}/100</span>
                                <span>{item.targetRole}</span>
                            </div>

                            <h2>{item.resumeFileName}</h2>

                            <p><b>Analysis ID:</b> {item.id}</p>

                            <p>
                                <b>Created:</b>{" "}
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString()
                                    : "Not available"}
                            </p>

                            <p><b>Conversation:</b> {item.conversationId}</p>

                            <button onClick={() => navigate(`/career-history/${item.id}`)}>
                                Open Analysis
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}