import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

import type { AppDispatch, RootState } from "../../../app/store/store";

import { getPostComments } from "../../../entities/Comment/model/commentSlice";

import cls from "./CommentsList.module.css";

interface CommentsListProps {
  postId: string;
}

export const CommentsList = ({ postId }: CommentsListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const comments = useSelector(
    (state: RootState) => state.comments.commentsByPostId[postId] ?? [],
  );

  const isLoading = useSelector(
    (state: RootState) => state.comments.loadingByPostId[postId] ?? false,
  );

  useEffect(() => {
    dispatch(getPostComments(postId));
  }, [dispatch, postId]);

  if (isLoading) {
    return <div className={cls.message}>Loading comments...</div>;
  }

  if (comments.length === 0) {
    return <div className={cls.message}>No comments yet</div>;
  }

  return (
    <div className={cls.list}>
      {comments.map((comment) => {
        const firstLetter = comment.user.username[0]?.toUpperCase() ?? "";

        return (
          <div key={comment._id} className={cls.comment}>
            {comment.user.avatarUrl ? (
              <img
                src={comment.user.avatarUrl}
                alt={comment.user.username}
                className={cls.avatar}
              />
            ) : (
              <div className={cls.fallbackAvatar}>{firstLetter}</div>
            )}

            <div className={cls.content}>
              <div>
                <span className={cls.username}>{comment.user.username}</span>

                <span className={cls.text}>{comment.text}</span>
              </div>

              <span className={cls.time}>
                {formatDistanceToNow(new Date(comment.createdAt))}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
