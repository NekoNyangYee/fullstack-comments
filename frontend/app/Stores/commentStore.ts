import { create } from 'zustand';

interface CommentStore {
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    content: string;
    setContent: (content: string) => void;
    reset: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
    username: '',
    setUsername: (username) => set(() => ({ username })),
    password: '',
    setPassword: (password) => set(() => ({ password })),
    content: '',
    setContent: (content) => set(() => ({ content })),
    reset: () => set(() => ({ username: '', password: '', content: '' }))
}))