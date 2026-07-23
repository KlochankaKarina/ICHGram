import type { PostModalProps } from "../../../entities/Post/model/types";
import cls from "./PostModal.module.css";
import Heart from "../../../shared/assets/heart.svg";
import Comment from "../../../shared/assets/comment.svg";
import InstagramCircle from "../../../shared/assets/instagram_circle.svg";
import { PostActionsModal } from "../../PostActionsModal/ui/PostActionsModal";
import { useState } from "react";
import Three from "../../../shared/assets/three.svg";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store/store";
import { toggleLike } from "../../../entities/Post/model/postSlice";
import Liked from "../../../shared/assets/Liked.svg";
import { CommentsList } from "../../CommentsList/ui/CommentsList";
import { AddComment } from "../../AddComment/ui/AddComment";

export const PostModal = ({
  post,
  profile,
  onClose,
  onDeleted,
  isOwnProfile,
}: PostModalProps) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const myProfile = useSelector((state: RootState) => state.profile.myProfile);
  const dispatch = useDispatch<AppDispatch>();
  const postId = post?._id ?? "";
  const comments = useSelector(
    (state: RootState) => state.comments.commentsByPostId[postId] ?? [],
  );
  if (!post) return null;
  const isLiked = (post.likes ?? []).includes(myProfile?.user._id ?? "");

  const handleLike = () => {
    dispatch(toggleLike(post._id));
  };

  return (
    <div className={cls.overlay} onClick={onClose}>
      <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
        <img src={post.image} alt="Post image" className={cls.image} />
        <div className={cls.content}>
          <div className={cls.top}>
            <div className={cls.links}>
              <img
                src={InstagramCircle}
                alt="Instagram Circle"
                className={cls.instagram_circle}
              />
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className={cls.selfie} />
              ) : (
                <div className={cls.circle}>
                  <span className={cls.letter}>
                    {profile.user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className={cls.username}>
                <b>{profile.user.username}</b>
              </span>
            </div>
            {isOwnProfile && (
              <button
                className={cls.three}
                onClick={() => setIsActionsOpen(true)}
              >
                <img src={Three} alt="" />
              </button>
            )}
          </div>
          <div className={cls.middle_box}>
            {post.caption && (
              <div className={cls.middle}>
                <img
                  src={InstagramCircle}
                  alt="Instagram Circle"
                  className={cls.instagram_circle}
                />
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className={cls.selfie_caption}
                  />
                ) : (
                  <div className={cls.circle_caption}>
                    <span className={cls.letter}>
                      {profile.user.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <span className={cls.caption}>
                  <b>{profile.user.username}</b> {post.caption}
                </span>
              </div>
            )}
            <CommentsList postId={post._id} />
          </div>
          <div className={cls.reactions}>
            <img
              src={isLiked ? Liked : Heart}
              alt="Heart"
              onClick={handleLike}
            />
            <img src={Comment} alt="Comment" />
            <span className={cls.comments_length}>
              {comments.length} comments
            </span>
          </div>
          <div className={cls.likes}>
            <span className={cls.count}>{post.likes?.length ?? 0} likes</span>
            <span className={cls.days}>
              {formatDistanceToNow(new Date(post.createdAt))}
            </span>
          </div>
          <AddComment postId={post._id} />
        </div>
      </div>
      {isActionsOpen && (
        <PostActionsModal
          post={post}
          profile={profile}
          onClose={() => setIsActionsOpen(false)}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
};
