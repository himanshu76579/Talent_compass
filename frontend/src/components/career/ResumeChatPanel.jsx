// import { useEffect, useState } from "react";
// import {
//     askResumeQuestionApi,
//     getResumeChatHistoryApi
// } from "../api/CareerApiService";
// import { useAuth } from "../security/AuthContext";

// export default function ResumeChatPanel({ analysisId, conversationId }) {
//     const authContext = useAuth();

//     const [question, setQuestion] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (analysisId) {
//             loadChatHistory();
//         }
//     }, [analysisId]);

//     async function loadChatHistory() {
//         try {
//             const response = await getResumeChatHistoryApi(
//                 authContext.username,
//                 analysisId
//             );

//             const formatted = response.data.map(msg => ({
//                 role: msg.role === "USER" ? "user" : "ai",
//                 content: msg.message
//             }));

//             setMessages(formatted);
//         } catch (error) {
//             setMessages([]);
//         }
//     }

//     async function askQuestion(customQuestion) {
//         const finalQuestion = customQuestion || question;

//         if (!finalQuestion.trim()) {
//             return;
//         }

//         setMessages(prev => [
//             ...prev,
//             {
//                 role: "user",
//                 content: finalQuestion
//             }
//         ]);

//         setQuestion("");

//         try {
//             setLoading(true);

//             const response = await askResumeQuestionApi(authContext.username, {
//                 analysisId,
//                 conversationId,
//                 question: finalQuestion
//             });

//             setMessages(prev => [
//                 ...prev,
//                 {
//                     role: "ai",
//                     content: response.data.answer
//                 }
//             ]);
//         } catch (error) {
//             setMessages(prev => [
//                 ...prev,
//                 {
//                     role: "ai",
//                     content: "Sorry, AI could not answer this question."
//                 }
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="career-panel chat-panel">
//             <h2>Ask AI About Your Resume</h2>

//             <p>
//                 This chat loads old messages from backend and continues with the same
//                 conversationId.
//             </p>

//             <div className="quick-questions">
//                 <button onClick={() => askQuestion("How can I improve my ATS score?")}>
//                     Improve ATS Score
//                 </button>

//                 <button onClick={() => askQuestion("Give me better resume bullet points.")}>
//                     Resume Bullets
//                 </button>

//                 <button onClick={() => askQuestion("What should I prepare first for interview?")}>
//                     Interview Prep
//                 </button>
//             </div>

//             <div className="chat-box">
//                 {messages.length === 0 && (
//                     <p className="chat-empty">
//                         Ask follow-up questions about resume, roadmap, or interview.
//                     </p>
//                 )}

//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={msg.role === "user" ? "chat-msg user-msg" : "chat-msg ai-msg"}
//                     >
//                         <strong>{msg.role === "user" ? "You" : "AI"}</strong>
//                         <p>{msg.content}</p>
//                     </div>
//                 ))}

//                 {loading && (
//                     <div className="chat-msg ai-msg">
//                         <strong>AI</strong>
//                         <p>Thinking...</p>
//                     </div>
//                 )}
//             </div>

//             <div className="chat-input">
//                 <textarea
//                     rows="3"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     placeholder="Ask question about your resume..."
//                 />

//                 <button onClick={() => askQuestion()}>
//                     Ask AI
//                 </button>
//             </div>
//         </div>
//     );
// }



// import { useEffect, useState } from "react";
// import {
//     askResumeQuestionStreamApi,
//     getResumeChatHistoryApi
// } from "../api/CareerApiService";
// import { useAuth } from "../security/AuthContext";

// export default function ResumeChatPanel({ analysisId, conversationId }) {
//     const authContext = useAuth();

//     const [question, setQuestion] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (analysisId) {
//             loadChatHistory();
//         }
//     }, [analysisId]);

//     async function loadChatHistory() {
//         try {
//             const response = await getResumeChatHistoryApi(
//                 authContext.username,
//                 analysisId
//             );

//             const formatted = response.data.map(msg => ({
//                 role: msg.role === "USER" ? "user" : "ai",
//                 content: msg.message
//             }));

//             setMessages(formatted);
//         } catch (error) {
//             setMessages([]);
//         }
//     }

//     async function askQuestion(customQuestion) {
//         const finalQuestion = customQuestion || question;

//         if (!finalQuestion.trim()) {
//             return;
//         }

//         setQuestion("");
//         setLoading(true);

//         setMessages(prev => [
//             ...prev,
//             {
//                 role: "user",
//                 content: finalQuestion
//             },
//             {
//                 role: "ai",
//                 content: ""
//             }
//         ]);

//         try {
//             await askResumeQuestionStreamApi(
//                 authContext.username,
//                 {
//                     analysisId,
//                     conversationId,
//                     question: finalQuestion
//                 },
//                 (chunk) => {
//                     setMessages(prev => {
//                         const copy = [...prev];
//                         const lastIndex = copy.length - 1;

//                         copy[lastIndex] = {
//                             ...copy[lastIndex],
//                             content: copy[lastIndex].content + chunk
//                         };

//                         return copy;
//                     });
//                 }
//             );
//         } catch (error) {
//             setMessages(prev => {
//                 const copy = [...prev];
//                 const lastIndex = copy.length - 1;

//                 copy[lastIndex] = {
//                     role: "ai",
//                     content: "Sorry, AI could not answer this question."
//                 };

//                 return copy;
//             });
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="career-panel chat-panel">
//             <h2>Ask AI About Your Resume</h2>

//             <p>
//                 This chat answers using your saved resume analysis and previous chat memory.
//             </p>

//             <div className="quick-questions">
//                 <button onClick={() => askQuestion("How can I improve my ATS score?")}>
//                     Improve ATS Score
//                 </button>

//                 <button onClick={() => askQuestion("Give me better resume bullet points.")}>
//                     Resume Bullets
//                 </button>

//                 <button onClick={() => askQuestion("What should I prepare first for interview?")}>
//                     Interview Prep
//                 </button>
//             </div>

//             <div className="chat-box">
//                 {messages.length === 0 && (
//                     <p className="chat-empty">
//                         Ask follow-up questions about resume, roadmap, or interview.
//                     </p>
//                 )}

//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={msg.role === "user" ? "chat-msg user-msg" : "chat-msg ai-msg"}
//                     >
//                         <strong>{msg.role === "user" ? "You" : "AI"}</strong>
//                         <p>{msg.content}</p>
//                     </div>
//                 ))}

//                 {loading && (
//                     <div className="chat-msg ai-msg">
//                         <strong>AI</strong>
//                         <p>Generating...</p>
//                     </div>
//                 )}
//             </div>

//             <div className="chat-input">
//                 <textarea
//                     rows="3"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     placeholder="Ask question about your resume."
//                 />

//                 <button onClick={() => askQuestion()} disabled={loading}>
//                     {loading ? "Answering..." : "Ask AI"}
//                 </button>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import {
    askResumeQuestionStreamApi,
    getResumeChatHistoryApi
} from "../api/CareerApiService";
import { useAuth } from "../security/AuthContext";

export default function ResumeChatPanel({ analysisId, conversationId }) {
    const authContext = useAuth();

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const chatStorageKey = `resume-chat-${authContext.username}-${analysisId}`;

    useEffect(() => {
        if (analysisId) {
            const savedMessages = localStorage.getItem(chatStorageKey);

            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            } else {
                loadChatHistory();
            }
        }
    }, [analysisId]);

    useEffect(() => {
        if (analysisId && messages.length > 0) {
            localStorage.setItem(chatStorageKey, JSON.stringify(messages));
        }
    }, [messages, analysisId]);

    async function loadChatHistory() {
        try {
            const response = await getResumeChatHistoryApi(
                authContext.username,
                analysisId
            );

            const formatted = (response.data || []).map(msg => ({
                role: msg.role === "USER" ? "user" : "ai",
                content: msg.message || msg.content || ""
            }));

            setMessages(formatted);
        } catch (error) {
            setMessages([]);
        }
    }

    async function askQuestion(customQuestion) {
        const finalQuestion = customQuestion || question;

        if (!finalQuestion.trim()) {
            return;
        }

        setQuestion("");
        setLoading(true);

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                content: finalQuestion
            },
            {
                role: "ai",
                content: ""
            }
        ]);

        try {
            await askResumeQuestionStreamApi(
                authContext.username,
                {
                    analysisId,
                    conversationId,
                    question: finalQuestion
                },
                (chunk) => {
                    setMessages(prev => {
                        const copy = [...prev];
                        const lastIndex = copy.length - 1;

                        copy[lastIndex] = {
                            ...copy[lastIndex],
                            content: copy[lastIndex].content + chunk
                        };

                        return copy;
                    });
                }
            );
        } catch (error) {
            setMessages(prev => {
                const copy = [...prev];
                const lastIndex = copy.length - 1;

                copy[lastIndex] = {
                    role: "ai",
                    content: "Sorry, AI could not answer this question."
                };

                return copy;
            });
        } finally {
            setLoading(false);
        }
    }

    function clearChat() {
        localStorage.removeItem(chatStorageKey);
        setMessages([]);
    }

    return (
        <div className="career-panel chat-panel">
            <h2>Ask AI About Your Resume</h2>

            <p>
                This chat answers using your saved resume analysis and previous chat memory.
            </p>

            <div className="quick-questions">
                <button onClick={() => askQuestion("How can I improve my ATS score?")}>
                    Improve ATS Score
                </button>

                <button onClick={() => askQuestion("Give me better resume bullet points.")}>
                    Resume Bullets
                </button>

                <button onClick={() => askQuestion("What should I prepare first for interview?")}>
                    Interview Prep
                </button>

                <button onClick={clearChat}>
                    Clear Chat
                </button>
            </div>

            <div className="chat-box">
                {messages.length === 0 && (
                    <p className="chat-empty">
                        Ask follow-up questions about resume, roadmap, or interview.
                    </p>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.role === "user" ? "chat-msg user-msg" : "chat-msg ai-msg"}
                    >
                        <strong>{msg.role === "user" ? "You" : "AI"}</strong>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <textarea
                    rows="3"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask question about your resume."
                />

                <button onClick={() => askQuestion()} disabled={loading}>
                    {loading ? "Answering..." : "Ask AI"}
                </button>
            </div>
        </div>
    );
}