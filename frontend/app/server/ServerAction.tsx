'use server';

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

export interface Comment {
    id: number;
    user_id: number;
    username: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export async function fetchComments(): Promise<Comment[]> {
    const response = await apiClient.get('/auth/comments');
    return response.data;
}

export async function addComment(username: string, password: string, content: string): Promise<{ message: string; data: Comment }> {
    const response = await apiClient.post('/auth/comments', { username, password, content });
    return response.data;
}

export async function updateComment(id: number, content: string, password: string, username: string): Promise<Comment> {
    const response = await apiClient.put(`/auth/comments/${id}`, { content, password, username });
    return response.data;
}

export async function deleteComment(id: number, password: string): Promise<void> {
    await apiClient.delete(`/auth/comments/${id}`, { data: { password } });
}
