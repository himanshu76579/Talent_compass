import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "../security/AuthContext";
import { retrieveAllTodosApi } from "../api/TodoApiService";
import { getCareerHistoryApi } from "../api/CareerApiService";
import "./WelcomeDashboard.css";

export default function WelcomeDashboard() {
    const { firstName } = useParams();
    const authContext = useAuth();

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        ai: 0,
        high: 0
    });

    const [latestAnalysis, setLatestAnalysis] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            const todoResponse = await retrieveAllTodosApi(authContext.username);
            const todos = todoResponse.data || [];

            setStats({
                total: todos.length,
                pending: todos.filter(todo => !todo.done).length,
                ai: todos.filter(todo => todo.createdFromAi).length,
                high: todos.filter(todo => todo.priority === "HIGH").length
            });
        } catch (error) {
            setStats({
                total: 0,
                pending: 0,
                ai: 0,
                high: 0
            });
        }

        try {
            const historyResponse = await getCareerHistoryApi(authContext.username);
            const history = historyResponse.data || [];

            if (history.length > 0) {
                setLatestAnalysis(history[0]);
            }
        } catch (error) {
            setLatestAnalysis(null);
        }
    }

    return (
        <PageLayout>
            <div className="welcome-page">
                <section className="welcome-hero">
                    <span>AI Student Career Platform</span>

                    <h1>Welcome, {firstName}</h1>

                    <p>
                        Manage todos manually or use AI to analyze your resume,
                        generate roadmap, create AI todos, and continue old resume chats.
                    </p>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <p>Total Todos</p>
                        <h2>{stats.total}</h2>
                    </div>

                    <div className="stat-card">
                        <p>Pending Todos</p>
                        <h2>{stats.pending}</h2>
                    </div>

                    <div className="stat-card">
                        <p>AI Created</p>
                        <h2>{stats.ai}</h2>
                    </div>

                    <div className="stat-card">
                        <p>High Priority</p>
                        <h2>{stats.high}</h2>
                    </div>
                </section>

                <section className="welcome-options">
                    <Link to="/todos" className="welcome-option-card manual">
                        <div className="option-icon">✅</div>

                        <h2>Manual Todo</h2>

                        <p>
                            Create, update, complete, and manage your daily tasks manually.
                            Also track AI-created todos from resume analyzer.
                        </p>

                        <b>Go to Manual Todo →</b>
                    </Link>

                    <Link to="/career-analyzer" className="welcome-option-card ai">
                        <div className="option-icon">🤖</div>

                        <h2>Resume Analyzer</h2>

                        <p>
                            Upload resume and company requirement. AI generates ATS score,
                            missing skills, roadmap, interview questions, and todos.
                        </p>

                        <b>Go to Resume Analyzer →</b>
                    </Link>
                </section>

                {latestAnalysis && (
                    <section className="latest-analysis">
                        <div>
                            <p>Latest Resume Analysis</p>
                            <h2>{latestAnalysis.resumeFileName}</h2>
                            <span>
                                {latestAnalysis.targetRole} • ATS {latestAnalysis.atsScore}/100
                            </span>
                        </div>

                        <Link to={`/career-history/${latestAnalysis.id}`}>
                            Open Latest Analysis →
                        </Link>
                    </section>
                )}
            </div>
        </PageLayout>
    );
}