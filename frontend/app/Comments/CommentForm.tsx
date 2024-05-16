'use client';

import React, { FormEvent, useEffect, useState } from "react";
import { fetchComments, addComment, updateComment, deleteComment } from '../server/ServerAction'
import { useCommentStore } from "../Stores/commentStore";
import '../../public/scss/commentForm.scss';
import Image from "next/image";

interface Comment {
    id: number;
    user_id: number;
    username: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export const CommentForm: React.FC = () => {
    const {
        username, setUsername,
        password, setPassword,
        content, setContent,
        message, setMessage,
        comments, setComments, addComment: addCommentToStore, updateComment: updateCommentInStore, deleteComment: deleteCommentFromStore,
        reset
    } = useCommentStore();

    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>('');

    useEffect(() => {
        // 컴포넌트가 마운트될 때 모든 댓글을 가져옵니다.
        const fetchData = async () => {
            try {
                const data = await fetchComments();
                setComments(data);
            } catch (err: any) {
                console.error('Error fetching comments:', err.message);
            }
        };

        fetchData();
    }, [setComments]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 로컬 스토리지에서 사용자 이름 가져오기
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        // 사용자 이름이 변경될 때 로컬 스토리지에 저장
        localStorage.setItem('username', username);
    }, [username]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await addComment(username, password, content);
            setMessage(data.message);
            addCommentToStore(data.data); // 기존 댓글 유지하면서 새로운 댓글 추가
            reset();
        } catch (err: any) {
            console.error('Error adding comment:', err.message);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const password: string | null = prompt('비밀번호를 입력하세요.');
            if (password) {
                await deleteComment(id, password);
                deleteCommentFromStore(id);
            } else {
                alert('비밀번호를 다시 입력하세요.');
            }
        } catch (err: any) {
            console.error('Error deleting comment:', err.message);
        }
    };

    const startEdit = (comment: Comment) => {
        setEditMode(comment.id);
        setEditContent(comment.content);
    }

    const handleEdit = async (e: FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        try {
            const password: string | null = prompt('비밀번호를 입력하세요.');
            if (password) {
                const data = await updateComment(id, editContent, password, username);
                updateCommentInStore(data);
                setEditMode(null);
                setEditContent('');
            } else {
                alert('비밀번호를 다시 입력하세요.');
            }
        } catch (err: any) {
            console.error('Error updating comment:', err.message);
        }
    }

    return (
        <div>
            {message && <p>{message}</p>}
            {comments.map(comment => ( // 모든 댓글 출력
                <div key={comment.id} className="comment-container">
                    <div className="comment-user-info-container">
                        <Image src="/user-profile.jpg" alt="user" width={38} height={38} />
                        <div className="comment-user-container">
                            <div className="comment-info-container">
                                <p style={{ fontWeight: "bold", fontSize: "17px" }}>{comment.username}</p>
                                <p style={{ color: "#868686", fontSize: "14px" }}>
                                    {new Date(comment.updated_at).toLocaleString()}
                                    {comment.updated_at !== comment.created_at && ' (수정됨)'}
                                </p>
                            </div>
                            <div className="comment-content-container">
                                <p>{comment.content}</p>
                                <div className="comment-tool-button">
                                    <button onClick={() => startEdit(comment)}>
                                        <Image src="/edit.svg" alt="edit" width={18} height={18} />
                                    </button>
                                    <button onClick={() => handleDelete(comment.id)}>
                                        <Image src="/delete.svg" alt="delete" width={18} height={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {editMode === comment.id && (
                        <form onSubmit={(e) => handleEdit(e, comment.id)}>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                required
                            />
                            <button type="submit">수정 완료</button>
                        </form>
                    )}
                </div>
            ))}
            <form onSubmit={handleSubmit} className="form-container">
                <div className="userinfo-container">
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="userinfo-input-container"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="userinfo-input-container"
                    />
                </div>
                <div className="textarea-container">
                    <textarea
                        placeholder="댓글 작성"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <button type="submit">
                        <Image src="/send.svg" alt="send" width={16} height={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;
