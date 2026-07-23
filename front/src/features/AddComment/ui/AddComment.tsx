import { type FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../app/store/store";

import { createComment } from "../../../entities/Comment/model/commentSlice";

import Smile from "../../../shared/assets/Smile.svg";

import cls from "./AddComment.module.css";

interface AddCommentProps {
  postId: string;
}

export const AddComment = ({ postId }: AddCommentProps) => {
  const [text, setText] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const isCreating = useSelector(
    (state: RootState) => state.comments.creatingByPostId[postId] ?? false,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || isCreating) {
      return;
    }

    try {
      await dispatch(
        createComment({
          postId,
          text: trimmedText,
        }),
      ).unwrap();

      setText("");
    } catch (error) {
      console.error("Не вдалося створити коментар:", error);
    }
  };

  return (
    <form className={cls.bottom} onSubmit={handleSubmit}>
      <div className={cls.comment}>
        <img src={Smile} alt="Smile" />

        <input
          type="text"
          value={text}
          placeholder="Add comment"
          onChange={(event) => setText(event.target.value)}
          disabled={isCreating}
        />
      </div>

      <button
        type="submit"
        className={cls.send}
        disabled={!text.trim() || isCreating}
      >
        {isCreating ? "Sending..." : "Send"}
      </button>
    </form>
  );
};
