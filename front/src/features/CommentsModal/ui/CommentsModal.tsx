import cls from "./CommentsModal.module.css";
import { CommentsList } from "../../CommentsList/ui/CommentsList";
import { AddComment } from "../../AddComment/ui/AddComment";

interface CommentModalProps {
  postId: string;
  onClose: () => void;
}

export const CommentsModal = ({ postId, onClose }: CommentModalProps) => {
  return (
    <div className={cls.overlay} onClick={onClose}>
      <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
        <div className={cls.content}>
          <CommentsList postId={postId} />
          <AddComment postId={postId} />
        </div>
      </div>
    </div>
  );
};
