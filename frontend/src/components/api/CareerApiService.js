// import { apiCLient } from "./apiClient";

// export const analyzeCareerApi = (username, formData) =>
//     apiCLient.post(`/api/career/analyze/${username}`, formData, {
//         headers: {
//             "Content-Type": "multipart/form-data"
//         }
//     });

// export const askResumeQuestionApi = (username, request) =>
//     apiCLient.post(`/api/career/ask/${username}`, request);

// export const getResumeChatHistoryApi = (username, analysisId) =>
//     apiCLient.get(`/api/career/chat/${username}/${analysisId}`);

// export const getCareerHistoryApi = (username) =>
//     apiCLient.get(`/api/career/history/${username}`);

// export const getCareerAnalysisByIdApi = (username, analysisId) =>
//     apiCLient.get(`/api/career/history/${username}/${analysisId}`);

import { apiCLient } from "./apiClient";

export const analyzeCareerApi = (username, formData) =>
    apiCLient.post(`/api/career/analyze/${username}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

export const askResumeQuestionApi = (username, request) =>
    apiCLient.post(`/api/career/ask/${username}`, request);

export const getResumeChatHistoryApi = (username, analysisId) =>
    apiCLient.get(`/api/career/chat/${username}/${analysisId}`);

export const getCareerHistoryApi = (username) =>
    apiCLient.get(`/api/career/history/${username}`);

export const getCareerAnalysisByIdApi = (username, analysisId) =>
    apiCLient.get(`/api/career/history/${username}/${analysisId}`);

export async function askResumeQuestionStreamApi(username, request, onChunk) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token missing. Please login again.");
    }

    const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(
        `http://localhost:8080/api/career/ask-stream/${username}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        throw new Error("Streaming failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
        const { value, done } = await reader.read();

        if (done) {
            break;
        }

        const chunk = decoder.decode(value, { stream: true });

        chunk
            .split("\n")
            .filter(line => line.startsWith("data:"))
            .forEach(line => {
                const text = line.substring(5); // important: no trim()

                if (text && text.trim() !== "[DONE]") {
                    onChunk(text);
                }
            });
    }
}