import { useDispatch, useSelector } from "react-redux";
import cls from "./ProfilePage.module.css";
import { type AppDispatch, type RootState } from "../../app/store/store";
import { logout } from "../../entities/User/model/userSlice";
import InstagramCircle from "../../shared/assets/instagram_circle.svg";
import { useEffect, useState } from "react";
import {
  fetchProfile,
  fetchProfileByUsername,
  toggleFollowByUsername,
} from "../../entities/Profile/model/profileSlice";
import Site from "../../shared/assets/site.svg";
import { useNavigate, useParams } from "react-router-dom";
import { AppRoutes, RoutePath } from "../../shared/config/RouteConfig";
import {
  getPosts,
  getPostsByUsername,
} from "../../entities/Post/model/postSlice";
import { PostModal } from "../../features/postModal/ui/PostModal";
import type { Post } from "../../entities/Post/model/types";

function ProfilePage() {
  const { profile, isLoading, followLoading, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const actualSelectedPost = selectedPost
    ? (posts.find((post) => post._id === selectedPost._id) ?? null)
    : null;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { username } = useParams<{
    username: string;
  }>();
  const isOwnProfile = !username;
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    setSelectedPost(null);

    if (username) {
      dispatch(fetchProfileByUsername(username));
      dispatch(getPostsByUsername(username));
    } else {
      dispatch(fetchProfile());
      dispatch(getPosts());
    }
  }, [dispatch, username]);

  function logoutUser() {
    dispatch(logout());
  }

  function edit() {
    navigate(RoutePath[AppRoutes.EDIT]);
  }

  async function handleFollow() {
    if (!username || followLoading) {
      return;
    }

    try {
      await dispatch(toggleFollowByUsername(username)).unwrap();

      await dispatch(fetchProfileByUsername(username)).unwrap();
    } catch (error) {
      console.error("Follow error:", error);
    }
  }

  const handlePostDeleted = () => {
    setSelectedPost(null);
  };

  //console.log(profile, posts);
  return (
    <div className={cls.profile}>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className={cls.content}>
        <div className={cls.links}>
          <img
            src={InstagramCircle}
            alt="Instagram Circle"
            className={cls.instagram_circle}
          />
          {profile?.avatarUrl ? (
            <img src={profile?.avatarUrl} alt="Selfie" className={cls.selfie} />
          ) : (
            <div className={cls.letter}>
              {profile?.user.username.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className={cls.right_content}>
          <div className={cls.right}>
            <h1 className={cls.username}>{profile?.user.username}</h1>
            {isOwnProfile ? (
              <>
                <button className={cls.edit} onClick={edit}>
                  Edit profile
                </button>
                <button onClick={logoutUser} className={cls.logout}>
                  logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={cls.follow}
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {followLoading
                    ? "Loading..."
                    : profile?.isFollowing
                      ? "Following"
                      : "Follow"}
                </button>
                <button className={cls.message}>Message</button>
              </>
            )}
          </div>
          <div className={cls.info}>
            <span>
              <b>{posts.length}</b> posts
            </span>
            <span>
              <b>{profile?.followers?.length ?? 0}</b> followers
            </span>
            <span>
              <b>{profile?.following?.length ?? 0}</b> following
            </span>
          </div>
          <div className={cls.profile_description}>
            <ul className={cls.bio}>
              {profile?.bio &&
                profile?.bio
                  .split("\n")
                  .map((item, index) => <li key={index}>{item}</li>)}
            </ul>
            <div className={cls.site}>
              {profile?.website && (
                <>
                  <img src={Site} alt="Website" />
                  <span>{profile?.website}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {posts.length === 0 && <p className={cls.no}>You have no posts</p>}
      <div className={cls.posts}>
        {posts.length > 0 &&
          posts.map((post) => (
            <div
              key={post._id}
              className={cls.post}
              onClick={() => setSelectedPost(post)}
            >
              <img src={post.image} alt="Post image" className={cls.post_img} />
            </div>
          ))}
      </div>
      {profile && (
        <PostModal
          post={actualSelectedPost}
          profile={profile}
          onClose={() => setSelectedPost(null)}
          onDeleted={handlePostDeleted}
          isOwnProfile={isOwnProfile}
        />
      )}
    </div>
  );
}

export default ProfilePage;
