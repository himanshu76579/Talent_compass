import { Link } from "react-router-dom";
import { useState } from "react";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "../security/AuthContext";
import { analyzeCareerApi } from "../api/CareerApiService";
import CareerAnalysisResult from "./CareerAnalysisResult";
import ResumeChatPanel from "./ResumeChatPanel";
import "./Career.css";

const loadingSteps = [
    "Extracting resume text...",
    "Comparing with job description...",
    "Finding missing skills...",
    "Creating roadmap...",
    "Saving AI todos..."
];

export default function CareerAnalyzerComponent() {
    const authContext = useAuth();

    const [resume, setResume] = useState(null);
    const [targetRole, setTargetRole] = useState("Software Engineer");
    const [jobDescription, setJobDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingIndex, setLoadingIndex] = useState(0);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    async function handleAnalyze(e) {
        e.preventDefault();

        if (!resume) {
            setError("Please upload resume PDF.");
            return;
        }

        if (resume.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            return;
        }

        if (resume.size > 10 * 1024 * 1024) {
            setError("PDF size must be less than 10MB.");
            return;
        }

        if (!jobDescription.trim() || jobDescription.trim().length < 50) {
            setError("Please paste proper company/job description with at least 50 characters.");
            return;
        }

        let interval;

        try {
            setLoading(true);
            setError("");
            setResult(null);

            let step = 0;
            interval = setInterval(() => {
                step = (step + 1) % loadingSteps.length;
                setLoadingIndex(step);
            }, 1200);

            const formData = new FormData();
            formData.append("resume", resume);
            formData.append("targetRole", targetRole);
            formData.append("jobDescription", jobDescription);

            const response = await analyzeCareerApi(authContext.username, formData);

            setResult(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Resume analysis failed. Please check backend logs."
            );
        } finally {
            clearInterval(interval);
            setLoading(false);
            setLoadingIndex(0);
        }
    }

    return (
        <PageLayout>
            <div className="career-page">
                <section className="career-hero">
                    <div>
                        <span>AI Resume Analyzer</span>

                        <h1>Analyze Resume and Create Todos</h1>

                        <p>
                            Upload your resume and company requirement. AI will generate
                            ATS score, missing skills, roadmap, interview questions,
                            learning sources, and save career todos automatically.
                        </p>
                    </div>

                    <div className="career-hero-actions">
                        <Link to={`/welcome/${authContext.firstName}`}>Home</Link>
                        <Link to="/todos">Go to Todo</Link>
                        <Link to="/career-history">View History</Link>
                    </div>
                </section>

                <section className="career-grid">
                    <div className="career-panel upload-panel">
                        <h2>Upload Details</h2>

                        <form className="career-form" onSubmit={handleAnalyze}>
                            <label>Step 1: Resume PDF</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setResume(e.target.files[0])}
                            />

                            <label>Step 2: Target Role</label>
                            <input
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="Software Engineer"
                            />

                            <label>Step 3: Company / Job Description</label>
                            <textarea
                                rows="12"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste company requirement here..."
                            />

                            {error && <div className="career-error">{error}</div>}

                            <button disabled={loading}>
                                {loading ? "Analyzing..." : "Analyze Resume"}
                            </button>
                        </form>

                        {loading && (
                            <div className="loading-steps">
                                <div className="spinner"></div>
                                <p>{loadingSteps[loadingIndex]}</p>
                            </div>
                        )}
                    </div>

                    <div className="career-results">
                        {!result && !loading && (
                            <div className="career-panel empty-result">
                                <h2>No analysis yet</h2>

                                <p>
                                    Upload your resume and job description. After analysis,
                                    AI-created todos will be available in your Todo page.
                                </p>
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
                </section>
            </div>
        </PageLayout>
    );
}