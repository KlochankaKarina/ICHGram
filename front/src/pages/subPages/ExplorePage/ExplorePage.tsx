import { useDispatch, useSelector } from "react-redux";
import cls from "./ExplorePage.module.css";
import { useEffect } from "react";
import { type AppDispatch, type RootState } from "../../../app/store/store";
import { getExplorePosts } from "../../../entities/Post/model/postSlice";

function ExplorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, err } = useSelector(
    (state: RootState) => state.posts,
  );

  useEffect(() => {
    dispatch(getExplorePosts());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (err) {
    return <p>{err}</p>;
  }

  return (
    <div className={cls.explore_posts}>
      {posts.map((post) => (
        <article key={post._id} className={cls.explore_post}>
          <img src={post.image} alt={post.caption || "Post image"} />
        </article>
      ))}
    </div>
  );
}

export default ExplorePage;
