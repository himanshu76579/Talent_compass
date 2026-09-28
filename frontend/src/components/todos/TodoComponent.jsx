import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "../security/AuthContext";
import {
    createTodoApi,
    retrieveTodoApi,
    updateTodoApi
} from "../api/TodoApiService";
import "./TodoStyles.css";

export default function TodoComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const authContext = useAuth();

    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [done, setDone] = useState(false);

    const [category, setCategory] = useState("Manual Todo");
    const [skill, setSkill] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [estimatedHours, setEstimatedHours] = useState(1);
    const [roadmapStepNo, setRoadmapStepNo] = useState("");

    const [createdFromAi, setCreatedFromAi] = useState(false);
    const [analysisKey, setAnalysisKey] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {
        if (id !== "-1") {
            loadTodo();
        }
    }, [id]);

    async function loadTodo() {
        try {
            const response = await retrieveTodoApi(id);
            const todo = response.data;

            setDescription(todo.description || "");
            setTargetDate(todo.targetDate || "");
            setDone(todo.done || false);

            setCategory(todo.category || "Manual Todo");
            setSkill(todo.skill || "");
            setPriority(todo.priority || "MEDIUM");
            setEstimatedHours(todo.estimatedHours || 1);
            setRoadmapStepNo(todo.roadmapStepNo || "");
            setCreatedFromAi(todo.createdFromAi || false);
            setAnalysisKey(todo.analysisKey || null);
        } catch (error) {
            setError("Failed to load todo.");
        }
    }

    async function saveTodo(e) {
        e.preventDefault();

        if (!description.trim()) {
            setError("Description is required.");
            return;
        }

        const todo = {
            description,
            targetDate,
            done,
            category,
            skill,
            priority,
            estimatedHours,
            roadmapStepNo: roadmapStepNo === "" ? null : Number(roadmapStepNo),
            createdFromAi,
            analysisKey
        };

        try {
            if (id === "-1") {
                await createTodoApi(authContext.username, {
                    ...todo,
                    createdFromAi: false,
                    category: "Manual Todo",
                    analysisKey: null
                });
            } else {
                await updateTodoApi(authContext.username, id, todo);
            }

            navigate("/todos");
        } catch (error) {
            setError("Failed to save todo.");
        }
    }

    return (
        <PageLayout>
            <div className="todo-form-page">
                <div className="todo-form-card">
                    <h1>{id === "-1" ? "Create Manual Todo" : "Update Todo"}</h1>

                    <p>
                        Todo supports manual tasks and AI-generated roadmap tasks.
                    </p>

                    {error && <div className="todo-message error">{error}</div>}

                    <form onSubmit={saveTodo} className="todo-form">
                        <label>Description</label>
                        <textarea
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter todo description..."
                        />

                        <label>Target Date</label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                        />

                        <label>Status</label>
                        <select
                            value={done ? "true" : "false"}
                            onChange={(e) => setDone(e.target.value === "true")}
                        >
                            <option value="false">Pending</option>
                            <option value="true">Done</option>
                        </select>

                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={createdFromAi}
                        >
                            <option value="Manual Todo">Manual Todo</option>
                            <option value="Career Roadmap">Career Roadmap</option>
                            <option value="Missing Skill">Missing Skill</option>
                            <option value="Weak Skill">Weak Skill</option>
                            <option value="Interview Prep">Interview Prep</option>
                        </select>

                        <label>Skill</label>
                        <input
                            type="text"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            placeholder="Spring AI, React, JWT..."
                        />

                        <label>Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                        </select>

                        <label>Estimated Hours</label>
                        <input
                            type="number"
                            min="1"
                            value={estimatedHours}
                            onChange={(e) => setEstimatedHours(Number(e.target.value))}
                        />

                        <label>Roadmap Step No</label>
                        <input
                            type="number"
                            value={roadmapStepNo}
                            onChange={(e) => setRoadmapStepNo(e.target.value)}
                            placeholder="Only for AI roadmap task"
                        />

                        {createdFromAi && (
                            <div className="ai-info-box">
                                This todo was created by Resume Analyzer AI.
                            </div>
                        )}

                        <div className="todo-form-actions">
                            <button type="button" onClick={() => navigate("/todos")}>
                                Cancel
                            </button>

                            <button type="submit">
                                Save Todo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
}