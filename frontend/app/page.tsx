import Image from "next/image";
import { CommentForm } from "./Comments/CommentForm";

import '../public/scss/main.scss';

export default function Home() {
  return (
    <div className="container">
      <h1>여기는 댓글 다는 곳입니다.</h1>
      <CommentForm />
    </div>
  );
}
