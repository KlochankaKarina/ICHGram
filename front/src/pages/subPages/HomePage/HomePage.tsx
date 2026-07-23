import { useDispatch, useSelector } from "react-redux";
import cls from "./HomePage.module.css";
import { useEffect, useState } from "react";
import { type AppDispatch, type RootState } from "../../../app/store/store";
import {
  getFeedPosts,
  toggleLike,
} from "../../../entities/Post/model/postSlice";
import { formatDistanceToNow } from "date-fns";
import Punkt from "../../../shared/assets/punkt.webp";
import Like from "../../../shared/assets/heart.svg";
import Liked from "../../../shared/assets/Liked.svg";
import Comment from "../../../shared/assets/comment.svg";
import { CommentsModal } from "../../../features/CommentsModal/ui/CommentsModal";

function HomePage() {
  const { posts, loading, err } = useSelector(
    (state: RootState) => state.posts,
  );
  const myProfile = useSelector((state: RootState) => state.profile.myProfile);
  const commentsByPostId = useSelector(
    (state: RootState) => state.comments.commentsByPostId,
  );
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getFeedPosts());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (err) {
    return <p>{err}</p>;
  }
  //console.log(posts);
  const handleLike = (postId: string) => {
    dispatch(toggleLike(postId));
  };

  const handleCommentClick = (postId: string) => {
    setSelectedPostId(postId);
  };

  return (
    <div className={cls.home_posts}>
      {posts.length === 0 ? (
        <p>There are no posts in your feed yet</p>
      ) : (
        posts.map((post) => {
          const author = typeof post.user === "string" ? null : post.user;
          const isLiked = (post.likes ?? []).includes(
            myProfile?.user._id ?? "",
          );
          const loadedComments = commentsByPostId[post._id];

          const commentsCount =
            loadedComments !== undefined
              ? loadedComments.length
              : (post.commentsCount ?? 0);
          return (
            <article key={post._id} className={cls.post_block}>
              <div className={cls.user}>
                <div className={cls.selfie}>
                  {author?.avatarUrl ? (
                    <img
                      src={author?.avatarUrl}
                      alt=""
                      className={cls.avatar}
                    />
                  ) : (
                    <div className={cls.letter}>
                      {author?.username.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={cls.user_info}>
                  <span className={cls.username}>{author?.username}</span>
                  <div className={cls.time_block}>
                    <img src={Punkt} alt="Punkt" className={cls.punkt} />
                    <span className={cls.time}>
                      {formatDistanceToNow(new Date(post.createdAt))}
                    </span>
                    <img src={Punkt} alt="Punkt" className={cls.punkt} />
                  </div>
                </div>
              </div>

              <img
                src={post.image}
                alt={post.caption || "Post image"}
                className={cls.image}
              />
              <div className={cls.reactions}>
                <img
                  src={isLiked ? Liked : Like}
                  alt="Like"
                  onClick={() => handleLike(post._id)}
                />
                <img
                  src={Comment}
                  alt="Comment"
                  onClick={() => handleCommentClick(post._id)}
                />
              </div>
              <p className={cls.likes_number}>
                <b>{post.likes?.length ?? 0} likes</b>
              </p>
              {post.caption && (
                <div className={cls.caption}>
                  <b>{author?.username}</b>
                  <span>{post.caption}</span>
                </div>
              )}
              <div className={cls.comments_block}>
                <p className={cls.author}></p>
                <p className={cls.comment}></p>
              </div>
              <button
                className={cls.all}
                onClick={() => handleCommentClick(post._id)}
              >
                View all comments ({commentsCount})
              </button>
            </article>
          );
        })
      )}
      {selectedPostId && (
        <CommentsModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
