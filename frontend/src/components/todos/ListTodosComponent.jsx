import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "../security/AuthContext";
import {
    deleteTodoApi,
    retrieveAiTodosApi,
    retrieveAllTodosApi,
    updateTodoApi
} from "../api/TodoApiService";
import "./TodoStyles.css";

export default function ListTodosComponent() {
    const authContext = useAuth();
    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    const [allTodos, setAllTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAllTodos("all");
    }, []);

    async function loadAllTodos(nextFilter = "all") {
        try {
            setLoading(true);
            setMessage("");

            const response = await retrieveAllTodosApi(authContext.username);
            const data = response.data || [];

            setAllTodos(data);
            applyFilter(nextFilter, data);
        } catch (error) {
            setMessage("Failed to load todos.");
        } finally {
            setLoading(false);
        }
    }

    async function loadAiTodos() {
        try {
            setLoading(true);
            setMessage("");
            setFilter("ai");

            const response = await retrieveAiTodosApi(authContext.username);
            setTodos(response.data || []);
        } catch (error) {
            setMessage("Failed to load AI todos.");
        } finally {
            setLoading(false);
        }
    }

    function applyFilter(type, source = allTodos) {
        setFilter(type);

        if (type === "all") {
            setTodos(source);
        } else if (type === "manual") {
            setTodos(source.filter(todo => !todo.createdFromAi));
        } else if (type === "pending") {
            setTodos(source.filter(todo => !todo.done));
        } else if (type === "done") {
            setTodos(source.filter(todo => todo.done));
        } else if (type === "high") {
            setTodos(source.filter(todo => todo.priority === "HIGH"));
        }
    }

    async function toggleDone(todo) {
        try {
            const updatedTodo = {
                ...todo,
                done: !todo.done
            };

            await updateTodoApi(authContext.username, todo.id, updatedTodo);

            if (filter === "ai") {
                await loadAiTodos();
            } else {
                await loadAllTodos(filter);
            }
        } catch (error) {
            setMessage("Failed to update todo.");
        }
    }

    async function deleteTodo(id) {
        try {
            await deleteTodoApi(id);
            setMessage("Todo deleted successfully.");

            if (filter === "ai") {
                await loadAiTodos();
            } else {
                await loadAllTodos(filter);
            }
        } catch (error) {
            setMessage("Failed to delete todo.");
        }
    }

    return (
        <PageLayout>
            <div className="todo-page">
                <section className="todo-hero">
                    <div>
                        <span>Todo Manager</span>

                        <h1>Manual + AI Todos</h1>

                        <p>
                            Track manual tasks and AI-generated career roadmap tasks
                            from one Todo table.
                        </p>
                    </div>

                    <button onClick={() => navigate("/todos/-1")}>
                        + Add Manual Todo
                    </button>
                </section>

                {message && <div className="todo-message">{message}</div>}

                <div className="todo-toolbar">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => loadAllTodos("all")}
                    >
                        All
                    </button>

                    <button
                        className={filter === "ai" ? "active" : ""}
                        onClick={loadAiTodos}
                    >
                        AI Todos
                    </button>

                    <button
                        className={filter === "manual" ? "active" : ""}
                        onClick={() => applyFilter("manual")}
                    >
                        Manual
                    </button>

                    <button
                        className={filter === "pending" ? "active" : ""}
                        onClick={() => applyFilter("pending")}
                    >
                        Pending
                    </button>

                    <button
                        className={filter === "done" ? "active" : ""}
                        onClick={() => applyFilter("done")}
                    >
                        Done
                    </button>

                    <button
                        className={filter === "high" ? "active" : ""}
                        onClick={() => applyFilter("high")}
                    >
                        High Priority
                    </button>
                </div>

                {loading && <div className="todo-loading">Loading todos...</div>}

                <div className="todo-list-grid">
                    {todos.map(todo => (
                        <div className="todo-card" key={todo.id}>
                            <div className="todo-card-top">
                                <span className="todo-category">
                                    {todo.category || "Manual Todo"}
                                </span>

                                <span className={`todo-priority ${todo.priority?.toLowerCase()}`}>
                                    {todo.priority || "MEDIUM"}
                                </span>

                                {todo.createdFromAi && (
                                    <span className="todo-ai">AI</span>
                                )}
                            </div>

                            <h3>{todo.description}</h3>

                            <div className="todo-meta">
                                <p><b>Status:</b> {todo.done ? "Done" : "Pending"}</p>
                                <p><b>Target Date:</b> {todo.targetDate || "Not set"}</p>
                                <p><b>Skill:</b> {todo.skill || "General"}</p>
                                <p><b>Estimated Hours:</b> {todo.estimatedHours || 1}</p>
                                <p><b>Roadmap Step:</b> {todo.roadmapStepNo || "-"}</p>
                            </div>

                            <div className="todo-actions">
                                <button onClick={() => toggleDone(todo)}>
                                    {todo.done ? "Mark Pending" : "Mark Done"}
                                </button>

                                <button onClick={() => navigate(`/todos/${todo.id}`)}>
                                    Update
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && todos.length === 0 && (
                    <div className="todo-empty">
                        <h2>No todos found</h2>
                        <p>Create manual todo or run Resume Analyzer to create AI todos.</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}