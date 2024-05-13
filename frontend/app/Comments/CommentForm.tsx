"use client"

import React from "react";
import axios from "axios";
import { useCommentStore } from "../Stores/commentStore";

export const CommentForm = () => {
    const { username, setUsername, password, setPassword, content, setContent, reset } = useCommentStore();
    const [message, setMessage] = React.useState<string>('');
    const [newComment, setNewComment] = React.useState<any>(null); // 상태 추가

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/comments', {
                username,
                password,
                content
            });
            setMessage(response.data.message);
            setNewComment(response.data); // 새로운 댓글 상태에 저장
            reset();
        } catch (err: any) {
            console.error('Axios error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div>
            {message && <p>{message}</p>}
            {newComment && ( // 새로운 댓글이 있을 경우에만 출력
                <div>
                    <p>ID: {newComment.id}</p>
                    <p>User ID: {newComment.user_id}</p>
                    <p>Content: {newComment.content}</p>
                    <p>Created At: {newComment.created_at}</p>
                    <p>Updated At: {newComment.updated_at}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <textarea
                        placeholder="내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button type="submit">댓글 등록</button>
            </form>
        </div>
    );
};