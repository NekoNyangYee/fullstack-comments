'use server';

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

export async function fetchComments() {
    const response = await apiClient.get('/auth/comments');
    return response.data;
}

export async function addComment(username: string, password: string, content: string) {
    const response = await apiClient.post('/auth/comments', { username, password, content });
    return response.data;
}

export async function updateComment(id: any, content: string, password: string, username: string) {
    const response = await apiClient.put(`/auth/commenanwltts/${id}`, { content, password, username });
    return response.data;
}

export async function deleteComment(id: any, password: string) {
    const response = await apiClient.delete(`/auth/comments/${id}`, { data: { password } });
    return response.data;
}
