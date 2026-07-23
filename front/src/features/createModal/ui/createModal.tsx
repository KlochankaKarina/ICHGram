import cls from "./createModal.module.css";
import type { Profile } from "../../../entities/Profile/model/types";
import Hochladen from "../../../shared/assets/hochladen.svg";
import Smile from "../../../shared/assets/Smile.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store/store";
import { AppRoutes, RoutePath } from "../../../shared/config/RouteConfig";
import { createPost } from "../../../entities/Post/model/postSlice";

interface CreateModalProps {
  profile: Profile;
  onClose: () => void;
}

export const CreateModal = ({ profile, onClose }: CreateModalProps) => {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const creating = useSelector((state: RootState) => state.posts.creating);

  const handleCreatePost = async () => {
    if (!imageFile) {
      alert("Оберіть картинку");
      return;
    }

    try {
      await dispatch(
        createPost({
          caption,
          image: imageFile,
        }),
      ).unwrap();

      setCaption("");
      setImageFile(null);
      setPreviewUrl("");

      onClose();
      navigate(RoutePath[AppRoutes.PROFILE]);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
  };

  return (
    <div className={cls.overlay} onClick={onClose}>
      <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
        <div className={cls.top}>
          <h1>Create new post</h1>
          <button type="button" disabled={creating} onClick={handleCreatePost}>
            {creating ? "Creating..." : "Share"}
          </button>
        </div>
        <div className={cls.content}>
          <div className={cls.left}>
            <label className={cls.uploadLabel}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Post preview"
                  className={cls.preview}
                />
              ) : (
                <>
                  <img src={Hochladen} alt="Upload" />
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>
          <div className={cls.right}>
            <div className={cls.right_top}>
              <div className={cls.user}>
                <div className={cls.username}>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Selfie"
                      className={cls.user_img}
                    />
                  ) : (
                    <div className={cls.circle}>
                      <span className={cls.letter}>
                        {profile.user.username[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{profile.user.username}</span>
                </div>
              </div>
              <div className={cls.counter}>{caption.length} / 2 200</div>
              <div className={cls.comment}>
                <img src={Smile} alt="Smile" />
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </div>
            <div className={cls.right_bottom}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
