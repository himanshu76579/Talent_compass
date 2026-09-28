import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthProvider from "./security/AuthContext";
import AuthenticatedRoute from "./security/AuthenticatedRoute";


import LoginComponent from './todos/LoginComponent'
import WelcomeDashboard from "./welcome/WelcomeDashboard";

import ListTodosComponent from "./todos/ListTodosComponent";
import TodoComponent from "./todos/TodoComponent";

import CareerAnalyzerComponent from "./career/CareerAnalyzerComponent";
import CareerHistoryComponent from "./career/CareerHistoryComponent";
import CareerAnalysisDetailComponent from "./career/CareerAnalysisDetailComponent";

export default function TodoApp() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/login" element={<LoginComponent />} />

                    <Route
                        path="/welcome/:firstName"
                        element={
                            <AuthenticatedRoute>
                                <WelcomeDashboard />
                            </AuthenticatedRoute>
                        }
                    />

                    <Route
                        path="/todos"
                        element={
                            <AuthenticatedRoute>
                                <ListTodosComponent />
                            </AuthenticatedRoute>
                        }
                    />

                    <Route
                        path="/todos/:id"
                        element={
                            <AuthenticatedRoute>
                                <TodoComponent />
                            </AuthenticatedRoute>
                        }
                    />

                    <Route
                        path="/career-analyzer"
                        element={
                            <AuthenticatedRoute>
                                <CareerAnalyzerComponent />
                            </AuthenticatedRoute>
                        }
                    />

                    <Route
                        path="/career-history"
                        element={
                            <AuthenticatedRoute>
                                <CareerHistoryComponent />
                            </AuthenticatedRoute>
                        }
                    />

                    <Route
                        path="/career-history/:analysisId"
                        element={
                            <AuthenticatedRoute>
                                <CareerAnalysisDetailComponent />
                            </AuthenticatedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}