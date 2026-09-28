import { apiCLient } from "./apiClient";

export const retrieveAllTodosApi = (username) =>
    apiCLient.get(`/users/${username}/todos`);

export const retrieveAiTodosApi = (username) =>
    apiCLient.get(`/users/${username}/todos/ai`);

export const retrieveTodoApi = (id) =>
    apiCLient.get(`/todos/${id}`);

export const createTodoApi = (username, todo) =>
    apiCLient.post(`/users/${username}/todos`, todo);

export const updateTodoApi = (username, id, todo) =>
    apiCLient.put(`/users/${username}/todos/${id}`, todo);

export const deleteTodoApi = (id) =>
    apiCLient.delete(`/todos/${id}`);