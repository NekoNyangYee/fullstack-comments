import { create } from 'zustand';

interface Comment {
    id: number;
    user_id: number;
    username: string;
    content: string;
    created_at: string;
    updated_at: string;
}

interface CommentStore {
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    content: string;
    setContent: (content: string) => void;
    message: string;
    setMessage: (message: string) => void;
    comments: Comment[];
    setComments: (comments: Comment[]) => void;
    addComment: (comment: Comment) => void;
    updateComment: (updatedComment: Comment) => void;
    deleteComment: (id: number) => void;
    reset: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
    username: '',
    setUsername: (username) => set(() => ({ username })),
    password: '',
    setPassword: (password) => set(() => ({ password })),
    content: '',
    setContent: (content) => set(() => ({ content })),
    message: '',
    setMessage: (message) => set(() => ({ message })),
    comments: [],
    setComments: (comments) => set(() => ({ comments })),
    addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
    updateComment: (updatedComment) => set((state) => ({
        comments: state.comments.map(comment =>
            comment.id === updatedComment.id ? updatedComment : comment
        )
    })),
    deleteComment: (id) => set((state) => ({
        comments: state.comments.filter(comment => comment.id !== id)
    })),
    reset: () => set(() => ({ username: '', password: '', content: '' }))
}));
