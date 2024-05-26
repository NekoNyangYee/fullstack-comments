// Stores/commentStore.ts
import create from 'zustand';
import { Comment } from '../server/ServerAction';

interface CommentStore {
    username: string;
    password: string;
    content: string;
    message: string;
    comments: Comment[];
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    setContent: (content: string) => void;
    setMessage: (message: string) => void;
    setComments: (comments: Comment[]) => void;
    addComment: (comment: Comment) => void;
    updateComment: (updatedComment: Comment) => void;
    deleteComment: (id: number) => void;
    reset: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
    username: '',
    password: '',
    content: '',
    message: '',
    comments: [],
    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
    setContent: (content) => set({ content }),
    setMessage: (message) => set({ message }),
    setComments: (comments) => set({ comments }),
    addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
    updateComment: (updatedComment) => set((state) => ({
        comments: state.comments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
        ),
    })),
    deleteComment: (id) => set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== id),
    })),
    reset: () => set({ username: '', password: '', content: '' }),
}));
