// import { useDispatch, useSelector } from "react-redux";
// import { type AppDispatch, type RootState } from "../../app/store/store";
// import { useEffect, useState } from "react";
// import cls from "./EditPage.module.css"
// import { useNavigate } from "react-router-dom";
// import { fetchProfile, updateProfile } from "../../entities/Profile/model/profileSlice";
// import { AppRoutes, RoutePath } from "../../shared/config/RouteConfig";
// import Site from "../../shared/assets/site.svg"
// function EditPage() {

// const { profile } = useSelector(
//     (state: RootState) => state.profile,
//   );

//   const [username, setUsername] = useState(profile?.user.username || "")
// const [website, setWebsite] = useState(profile?.website || "")
// const [bio, setBio] = useState(profile?.bio || "")
// const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "")
// const dispatch = useDispatch<AppDispatch>()
// const navigate = useNavigate()

// useEffect(() => {
//   if (!profile) {
//     dispatch(fetchProfile());
//   }
// }, [dispatch, profile]);

// useEffect(() => {
//   if (profile) {
//     setUsername(profile.user.username || "");
//     setWebsite(profile.website || "");
//     setBio(profile.bio || "");
//     setAvatarUrl(profile.avatarUrl || "");
//   }
// }, [profile]);

// function save(){
// dispatch(updateProfile(
//   {
//     username, bio, website, avatarUrl
//   }
// ))
// .unwrap()
// .then(()=>{
//   navigate(RoutePath[AppRoutes.PROFILE])
// })
// }

//   return (
//     <div className={cls.content}>
//    <h1 className={cls.title}>Edit Page</h1>
//    <div className={cls.main}>
//     <div className={cls.main_left}>
//       <img src="" alt="Profile Bild" className={cls.profile_bild}/>
//       <div className={cls.main_desc}>
//         <span>{profile?.user.username}</span>
//         {profile?.bio && (
//            <ul className={cls.bio}>
//  <li> {profile?.bio?.split("\n")[0]}</li>
// </ul>
//         )}
//       </div>
//     </div>
//     <button className={cls.add}>New photo</button>
//    </div>
//   <div className={cls.desc_block}>
//      <div className={cls.input_block}>
//     <label className={cls.label}>Username</label>
//     <input type="text" value={username} className={cls.input} onChange={(e)=>setUsername(e.target.value)}/>
//    </div>
//     <div className={cls.input_block}>
//     <label className={cls.label}>Website</label>
//     <div className={cls.site}>
//        <img src={Site} alt="Website" />
//     <input type="text" value={website} className={cls.input_web} onChange={(e)=>setWebsite(e.target.value)}/>
//     </div>
//    </div>
//     <div className={cls.input_block}>
//     <label className={cls.label}>About</label>
//    <div className={cls.text_area}>
//      <textarea value={bio} className={cls.text} onChange={(e)=>setBio(e.target.value)}/>
//       <div className={cls.counter}>{bio.length} / 150</div>
//    </div>
//    </div>
//   </div>
//    <button onClick={save} className={cls.save}>Save</button>
//     </div>
//   )
// }

// export default EditPage
import { type ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { type AppDispatch, type RootState } from "../../app/store/store";
import {
  fetchProfile,
  updateProfile,
} from "../../entities/Profile/model/profileSlice";
import { AppRoutes, RoutePath } from "../../shared/config/RouteConfig";

import Site from "../../shared/assets/site.svg";
import cls from "./EditPage.module.css";

function EditPage() {
  const { profile } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [username, setUsername] = useState(profile?.user.username || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [bio, setBio] = useState(profile?.bio || "");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || "");

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.user.username || "");
      setWebsite(profile.website || "");
      setBio(profile.bio || "");

      if (!avatarFile) {
        setAvatarPreview(profile.avatarUrl || "");
      }
    }
  }, [profile, avatarFile]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Можна вибрати лише JPG, PNG або WEBP");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір картинки не повинен перевищувати 5 MB");
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setAvatarFile(file);
    setAvatarPreview((previousPreview) => {
      if (previousPreview.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return previewUrl;
    });
  };

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const save = async () => {
    try {
      await dispatch(
        updateProfile({
          username,
          bio,
          website,
          avatar: avatarFile,
        }),
      ).unwrap();

      navigate(RoutePath[AppRoutes.PROFILE]);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className={cls.content}>
      <h1 className={cls.title}>Edit Page</h1>

      <div className={cls.main}>
        <div className={cls.main_left}>
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Profile"
              className={cls.profile_bild}
            />
          ) : (
            <div className={cls.profile_placeholder}>
              {username.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className={cls.main_desc}>
            <span>{profile?.user.username}</span>

            {profile?.bio && (
              <ul className={cls.bio}>
                <li>{profile.bio.split("\n")[0]}</li>
              </ul>
            )}
          </div>
        </div>

        <label className={cls.add}>
          <span className={cls.new}>New photo</span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            hidden
          />
        </label>
      </div>

      <div className={cls.desc_block}>
        <div className={cls.input_block}>
          <label className={cls.label}>Username</label>

          <input
            type="text"
            value={username}
            className={cls.input}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className={cls.input_block}>
          <label className={cls.label}>Website</label>

          <div className={cls.site}>
            <img src={Site} alt="Website" />

            <input
              type="text"
              value={website}
              className={cls.input_web}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>
        </div>

        <div className={cls.input_block}>
          <label className={cls.label}>About</label>

          <div className={cls.text_area}>
            <textarea
              value={bio}
              maxLength={150}
              className={cls.text}
              onChange={(event) => setBio(event.target.value)}
            />

            <div className={cls.counter}>{bio.length} / 150</div>
          </div>
        </div>
      </div>

      <button type="button" onClick={save} className={cls.save}>
        Save
      </button>
    </div>
  );
}

export default EditPage;
