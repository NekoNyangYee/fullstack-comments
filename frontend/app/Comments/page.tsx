// app/comments/page.tsx
import { fetchComments, Comment } from '../server/ServerAction';
import CommentForm from './CommentForm';

export const revalidate = 10; // 페이지를 주기적으로 재검증 (10초마다)

export default async function CommentsPage() {
    const comments: Comment[] = await fetchComments();

    return (
        <div>
            <h1>Comments</h1>
            <CommentForm initialComments={comments} />
        </div>
    );
}
