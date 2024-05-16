'use server';

import axios from 'axios';

export async function fetchComments() {
    const response = await axios.get('http://localhost:5000/api/auth/comments');
    return response.data;
}

export async function addComment(username: string, password: string, content: string) {
    const response = await axios.post('http://localhost:5000/api/auth/comments', { username, password, content });
    return response.data;
}

export async function updateComment(id: any, content: string, password: string, username: string) {
    const response = await axios.put(`http://localhost:5000/api/auth/comments/${id}`, { content, password, username });
    return response.data;
}

export async function deleteComment(id: any, password: string) {
    const response = await axios.delete(`http://localhost:5000/api/auth/comments/${id}`, { data: { password } });
    return response.data;
}
