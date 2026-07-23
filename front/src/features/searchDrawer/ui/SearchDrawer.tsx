import { useState } from "react";
import cls from "./SearchDrawer.module.css";
import { searchUsers, type ISearchUser } from "../../../entities/User/api/api";
import { useNavigate } from "react-router-dom";
import { Drawer } from "../../../shared/UI/Drawer/Drawer";

interface SearchDrawerProps {
  onClose: () => void;
}

export function SearchDrawer({ onClose }: SearchDrawerProps) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<ISearchUser[]>([]);
  const navigate = useNavigate();
  function clearInput() {
    setSearch("");
  }
  function openUserProfile(username: string) {
    navigate(`/users/${username}`);
    onClose();
  }
  async function handleSearch(value: string) {
    setSearch(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      const response = await searchUsers(value);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* <div className={cls.overlay} onClick={onClose} aria-hidden="true" />
      <aside className={cls.drawer}>
        <h2 className={cls.title}>Search</h2>
        <input
          className={cls.input}
          placeholder="Search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <span className={cls.kreis} onClick={clearInput}>
          X
        </span>
        <div className={cls.recent}>
          <h3>Recent</h3>
{
    users.map((user)=>(
        <div 
        key={user._id}
        className={cls.list}
        onClick={()=>openUserProfile(user.username)}>
            <div className={cls.user}>
              {
                user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Selfie" />
                ): (
                  <div className={cls.circle}>
                      <span className={cls.letter}>{user.username[0].toUpperCase()}</span>
                  </div>
                )
              }
             <span> {user.username}</span>
            </div>
        </div>
    ))
}
        </div>
      </aside> */}
      <Drawer title="Search" onClose={onClose}>
        <div className={cls.inputWrapper}>
          <input
            className={cls.input}
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {search && (
            <button type="button" className={cls.kreis} onClick={clearInput}>
              X
            </button>
          )}
        </div>

        <div className={cls.recent}>
          <h3>Recent</h3>

          {users.map((user) => (
            <div
              key={user._id}
              className={cls.list}
              onClick={() => openUserProfile(user.username)}
            >
              <div className={cls.user}>
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className={cls.avatar}
                  />
                ) : (
                  <div className={cls.circle}>
                    <span className={cls.letter}>
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                )}

                <span>{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
