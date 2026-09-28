// import { Link } from "react-router-dom";

// export default function CareerAnalysisResult({ result }) {
//     const analysis = result?.analysis;
//     const savedTodos = result?.savedTodos || [];

//     if (!analysis) {
//         return null;
//     }

//     return (
//         <>
//             <div className="career-panel score-panel">
//                 <div
//                     className="score-circle"
//                     style={{
//                         "--score": `${Math.min(analysis.atsScore || 0, 100)}%`
//                     }}
//                 >
//                     <strong>{analysis.atsScore || 0}</strong>
//                     <span>/100</span>
//                 </div>

//                 <div>
//                     <h2>ATS Score</h2>
//                     <p>{analysis.summary}</p>
//                     <small>Analysis ID: {result.analysisId}</small>
//                 </div>
//             </div>

//             <div className="summary-grid">
//                 <InfoCard title="Resume Summary" value={analysis.resumeSummary} />
//                 <InfoCard title="Job Summary" value={analysis.jobDescriptionSummary} />
//                 <InfoCard title="AI Analysis Summary" value={analysis.aiAnalysisSummary} />
//                 <InfoCard title="Todo Save Status" value={analysis.todoSaveStatus} />
//             </div>

//             <div className="career-panel">
//                 <h2>Skill Analysis</h2>

//                 <TagBlock title="Skills Present" items={analysis.skillsPresent} />
//                 <TagBlock title="Missing Skills" items={analysis.missingSkills} danger />
//                 <TagBlock title="Weak Skills" items={analysis.weakSkills} warning />
//                 <TagBlock title="Project Gaps" items={analysis.projectGaps} muted />
//             </div>

//             <div className="career-panel">
//                 <h2>Roadmap</h2>

//                 <div className="roadmap-list">
//                     {analysis.roadmap?.map(step => (
//                         <div className="roadmap-card" key={step.stepNo}>
//                             <div className="step-number">Step {step.stepNo}</div>

//                             <div>
//                                 <h3>{step.title}</h3>
//                                 <p>{step.description}</p>
//                                 <p><b>Skill:</b> {step.skill}</p>
//                                 <p><b>Estimated Days:</b> {step.estimatedDays}</p>

//                                 <ul>
//                                     {step.tasks?.map(task => (
//                                         <li key={task}>{task}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="career-panel">
//                 <h2>Company Readiness Plan</h2>

//                 <ListBlock title="Must Improve" items={analysis.companyReadinessPlan?.mustImprove} />
//                 <ListBlock title="Resume Keywords To Add" items={analysis.companyReadinessPlan?.resumeKeywordsToAdd} />
//                 <ListBlock title="Resume Bullet Suggestions" items={analysis.companyReadinessPlan?.resumeBulletSuggestions} />
//                 <ListBlock title="Expected Interview Questions" items={analysis.companyReadinessPlan?.expectedInterviewQuestions} />
//                 <ListBlock title="Coding Topics To Revise" items={analysis.companyReadinessPlan?.codingTopicsToRevise} />
//                 <ListBlock title="7 Day Plan" items={analysis.companyReadinessPlan?.sevenDayPlan} />
//             </div>

//             <div className="career-panel">
//                 <h2>Interview Questions</h2>

//                 <div className="question-grid">
//                     {analysis.interviewQuestions?.map((q, index) => (
//                         <div className="question-card" key={index}>
//                             <div className="question-tags">
//                                 <span>{q.relatedSkill}</span>
//                                 <span>{q.difficulty}</span>
//                             </div>

//                             <h3>{q.question}</h3>
//                             <p><b>Why asked:</b> {q.whyAsked}</p>
//                             <p><b>Answer hint:</b> {q.answerHint}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="career-panel">
//                 <h2>Learning Sources</h2>

//                 <div className="learning-grid">
//                     {analysis.learningSources?.map((source, index) => (
//                         <div className="learning-card" key={index}>
//                             <h3>{source.skill}</h3>
//                             <p><b>Official:</b> {source.officialDocumentation}</p>

//                             <ListBlock title="Tutorials" items={source.tutorials} />
//                             <ListBlock title="Practice Platforms" items={source.practicePlatforms} />
//                             <ListBlock title="Mini Projects" items={source.miniProjectIdeas} />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="career-panel">
//                 <h2>Saved AI Todos</h2>

//                 <p className="todo-success">
//                     {analysis.todoSaveStatus || "AI todos created successfully."}
//                 </p>

//                 <div className="saved-todo-grid">
//                     {savedTodos.map(todo => (
//                         <div className="saved-todo-card" key={todo.id}>
//                             <div className="todo-tags">
//                                 <span>{todo.category}</span>
//                                 <span>{todo.priority}</span>
//                                 <span>AI</span>
//                             </div>

//                             <h3>{todo.description}</h3>

//                             <p><b>Skill:</b> {todo.skill}</p>
//                             <p><b>Target Date:</b> {todo.targetDate}</p>
//                             <p><b>Estimated Hours:</b> {todo.estimatedHours}</p>
//                             <p><b>Roadmap Step:</b> {todo.roadmapStepNo}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <Link className="go-todo-link" to="/todos">
//                     Open Todo Page →
//                 </Link>
//             </div>
//         </>
//     );
// }

// function InfoCard({ title, value }) {
//     return (
//         <div className="info-card">
//             <h3>{title}</h3>
//             <p>{value || "Not available"}</p>
//         </div>
//     );
// }

// function TagBlock({ title, items, danger, warning, muted }) {
//     return (
//         <div className="tag-block">
//             <h3>{title}</h3>

//             <div className="tag-list">
//                 {items?.length > 0 ? items.map(item => (
//                     <span
//                         key={item}
//                         className={
//                             danger ? "tag danger" :
//                             warning ? "tag warning" :
//                             muted ? "tag muted" :
//                             "tag"
//                         }
//                     >
//                         {item}
//                     </span>
//                 )) : <p className="empty-small">No data</p>}
//             </div>
//         </div>
//     );
// }

// function ListBlock({ title, items }) {
//     return (
//         <div className="list-block">
//             <h3>{title}</h3>

//             {items?.length > 0 ? (
//                 <ul>
//                     {items.map(item => (
//                         <li key={item}>{item}</li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="empty-small">No data</p>
//             )}
//         </div>
//     );
// }

import { Link } from "react-router-dom";

export default function CareerAnalysisResult({ result }) {
    const analysis = result?.analysis;
    const savedTodos = result?.savedTodos || [];

    if (!analysis) {
        return null;
    }

    return (
        <>
            <div className="career-panel score-panel">
                <div
                    className="score-circle"
                    style={{
                        "--score": `${Math.min(analysis.atsScore || 0, 100)}%`
                    }}
                >
                    <strong>{analysis.atsScore || 0}</strong>
                    <span>/100</span>
                </div>

                <div>
                    <h2>ATS Score</h2>
                    <p>{renderValue(analysis.summary)}</p>
                    <small>Analysis ID: {result.analysisId}</small>
                </div>
            </div>

            <div className="summary-grid">
                <InfoCard title="Resume Summary" value={analysis.resumeSummary} />
                <InfoCard title="Job Summary" value={analysis.jobDescriptionSummary} />
                <InfoCard title="AI Analysis Summary" value={analysis.aiAnalysisSummary} />
                <InfoCard title="Todo Save Status" value={analysis.todoSaveStatus} />
            </div>

            <div className="career-panel">
                <h2>Skill Analysis</h2>

                <TagBlock title="Skills Present" items={analysis.skillsPresent} />
                <TagBlock title="Missing Skills" items={analysis.missingSkills} danger />
                <TagBlock title="Weak Skills" items={analysis.weakSkills} warning />
                <TagBlock title="Project Gaps" items={analysis.projectGaps} muted />
            </div>

            <div className="career-panel">
                <h2>Roadmap</h2>

                <div className="roadmap-list">
                    {analysis.roadmap?.length > 0 ? (
                        analysis.roadmap.map((step, index) => (
                            <div className="roadmap-card" key={step.stepNo || index}>
                                <div className="step-number">
                                    Step {step.stepNo || index + 1}
                                </div>

                                <div>
                                    <h3>{renderValue(step.title)}</h3>
                                    <p>{renderValue(step.description)}</p>
                                    <p>
                                        <b>Skill:</b> {renderValue(step.skill)}
                                    </p>
                                    <p>
                                        <b>Estimated Days:</b> {renderValue(step.estimatedDays)}
                                    </p>

                                    <ul>
                                        {step.tasks?.length > 0 ? (
                                            step.tasks.map((task, taskIndex) => (
                                                <li key={taskIndex}>
                                                    {renderValue(task)}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No tasks available</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-small">No roadmap available</p>
                    )}
                </div>
            </div>

            <div className="career-panel">
                <h2>Company Readiness Plan</h2>

                <ListBlock
                    title="Must Improve"
                    items={analysis.companyReadinessPlan?.mustImprove}
                />
                <ListBlock
                    title="Resume Keywords To Add"
                    items={analysis.companyReadinessPlan?.resumeKeywordsToAdd}
                />
                <ListBlock
                    title="Resume Bullet Suggestions"
                    items={analysis.companyReadinessPlan?.resumeBulletSuggestions}
                />
                <ListBlock
                    title="Expected Interview Questions"
                    items={analysis.companyReadinessPlan?.expectedInterviewQuestions}
                />
                <ListBlock
                    title="Coding Topics To Revise"
                    items={analysis.companyReadinessPlan?.codingTopicsToRevise}
                />
                <ListBlock
                    title="7 Day Plan"
                    items={analysis.companyReadinessPlan?.sevenDayPlan}
                />
            </div>

            <div className="career-panel">
                <h2>Interview Questions</h2>

                <div className="question-grid">
                    {analysis.interviewQuestions?.length > 0 ? (
                        analysis.interviewQuestions.map((q, index) => (
                            <div className="question-card" key={index}>
                                <div className="question-tags">
                                    <span>{renderValue(q.relatedSkill)}</span>
                                    <span>{renderValue(q.difficulty)}</span>
                                </div>

                                <h3>{renderValue(q.question)}</h3>
                                <p>
                                    <b>Why asked:</b> {renderValue(q.whyAsked)}
                                </p>
                                <p>
                                    <b>Answer hint:</b> {renderValue(q.answerHint)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="empty-small">No interview questions available</p>
                    )}
                </div>
            </div>

            <div className="career-panel">
                <h2>Learning Sources</h2>

                <div className="learning-grid">
                    {analysis.learningSources?.length > 0 ? (
                        analysis.learningSources.map((source, index) => (
                            <div className="learning-card" key={index}>
                                <h3>{renderValue(source.skill)}</h3>
                                <p>
                                    <b>Official:</b>{" "}
                                    {renderValue(source.officialDocumentation)}
                                </p>

                                <ListBlock title="Tutorials" items={source.tutorials} />
                                <ListBlock
                                    title="Practice Platforms"
                                    items={source.practicePlatforms}
                                />
                                <ListBlock
                                    title="Mini Projects"
                                    items={source.miniProjectIdeas}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="empty-small">No learning sources available</p>
                    )}
                </div>
            </div>

            <div className="career-panel">
                <h2>Saved AI Todos</h2>

                <p className="todo-success">
                    {renderValue(
                        analysis.todoSaveStatus || "AI todos created successfully."
                    )}
                </p>

                <div className="saved-todo-grid">
                    {savedTodos.length > 0 ? (
                        savedTodos.map((todo, index) => (
                            <div className="saved-todo-card" key={todo.id || index}>
                                <div className="todo-tags">
                                    <span>{renderValue(todo.category)}</span>
                                    <span>{renderValue(todo.priority)}</span>
                                    <span>AI</span>
                                </div>

                                <h3>{renderValue(todo.description)}</h3>

                                <p>
                                    <b>Skill:</b> {renderValue(todo.skill)}
                                </p>
                                <p>
                                    <b>Target Date:</b> {renderValue(todo.targetDate)}
                                </p>
                                <p>
                                    <b>Estimated Hours:</b>{" "}
                                    {renderValue(todo.estimatedHours)}
                                </p>
                                <p>
                                    <b>Roadmap Step:</b>{" "}
                                    {renderValue(todo.roadmapStepNo)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="empty-small">No todos saved</p>
                    )}
                </div>

                <Link className="go-todo-link" to="/todos">
                    Open Todo Page →
                </Link>
            </div>
        </>
    );
}

function InfoCard({ title, value }) {
    return (
        <div className="info-card">
            <h3>{title}</h3>
            <p>{renderValue(value) || "Not available"}</p>
        </div>
    );
}

function TagBlock({ title, items, danger, warning, muted }) {
    return (
        <div className="tag-block">
            <h3>{title}</h3>

            <div className="tag-list">
                {items?.length > 0 ? (
                    items.map((item, index) => (
                        <span
                            key={index}
                            className={
                                danger
                                    ? "tag danger"
                                    : warning
                                    ? "tag warning"
                                    : muted
                                    ? "tag muted"
                                    : "tag"
                            }
                        >
                            {renderValue(item)}
                        </span>
                    ))
                ) : (
                    <p className="empty-small">No data</p>
                )}
            </div>
        </div>
    );
}

function ListBlock({ title, items }) {
    return (
        <div className="list-block">
            <h3>{title}</h3>

            {items?.length > 0 ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{renderValue(item)}</li>
                    ))}
                </ul>
            ) : (
                <p className="empty-small">No data</p>
            )}
        </div>
    );
}

function renderValue(value) {
    if (value === null || value === undefined || value === "") {
        return "Not available";
    }

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return value.toString();
    }

    if (Array.isArray(value)) {
        return value.map(item => renderValue(item)).join(", ");
    }

    if (typeof value === "object") {
        if (value.day && value.task) {
            return `${value.day}: ${value.task}`;
        }

        if (value.skill && value.reason) {
            return `${value.skill}: ${value.reason}`;
        }

        if (value.title && value.description) {
            return `${value.title}: ${value.description}`;
        }

        if (value.question) {
            return value.question;
        }

        if (value.name) {
            return value.name;
        }

        return Object.values(value)
            .map(item => renderValue(item))
            .join(" - ");
    }

    return String(value);
}