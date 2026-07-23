import { type PostActionsModalProps } from "../../../entities/Post/model/types";
import cls from "./PostActionsModal.module.css";
// import type { Profile } from "../../../entities/Profile/model/types";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store/store";
import { deletedPost } from "../../../entities/Post/model/postSlice";

export const PostActionsModal = ({
  post,
  // profile,
  onClose,
  onDeleted,
}: PostActionsModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  if (!post) return null;

  const handleDeletePost = async () => {
    if (!post) return;

    try {
      await dispatch(deletedPost(post._id)).unwrap();

      onDeleted();
      onClose();
    } catch (error) {
      console.error("Delete post error:", error);
    }
  };

  return (
    <div className={cls.overlay} onClick={onClose}>
      <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
        <div className={cls.list}>
          <div className={cls.item} onClick={handleDeletePost}>
            Delete
          </div>
          <div className={cls.item}>Edit</div>
          <div className={cls.item} onClick={onClose}>
            Go to post
          </div>
          <div className={cls.item}>Copy link</div>
          <div className={cls.item} onClick={onClose}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};
