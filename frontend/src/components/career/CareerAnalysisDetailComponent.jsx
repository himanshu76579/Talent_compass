import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "../security/AuthContext";
import { getCareerAnalysisByIdApi } from "../api/CareerApiService";
import CareerAnalysisResult from "./CareerAnalysisResult";
import ResumeChatPanel from "./ResumeChatPanel";
import "./Career.css";

export default function CareerAnalysisDetailComponent() {
    const { analysisId } = useParams();
    const authContext = useAuth();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAnalysis();
    }, [analysisId]);

    async function loadAnalysis() {
        try {
            setLoading(true);
            setError("");

            const response = await getCareerAnalysisByIdApi(
                authContext.username,
                analysisId
            );

            setResult(response.data);
        } catch (error) {
            setError("Failed to load saved analysis.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageLayout>
            <div className="career-page">
                <section className="career-hero history-hero">
                    <div>
                        <span>Saved AI Report</span>

                        <h1>Resume Analysis Detail</h1>

                        <p>
                            This page reloads old analysis from backend and continues
                            the same resume chatbot conversation.
                        </p>
                    </div>
                </section>

                {error && <div className="career-error">{error}</div>}

                {loading && (
                    <div className="career-panel">
                        <h2>Loading analysis...</h2>
                    </div>
                )}

                {result && (
                    <>
                        <CareerAnalysisResult result={result} />

                        <ResumeChatPanel
                            analysisId={result.analysisId}
                            conversationId={result.conversationId}
                        />
                    </>
                )}
            </div>
        </PageLayout>
    );
}