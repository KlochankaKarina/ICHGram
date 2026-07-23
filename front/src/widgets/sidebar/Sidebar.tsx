import cls from "./Sidebar.module.css";
import Ichgram from "../../shared/assets/ICHGRA 2.svg";
import { NavLink } from "react-router-dom";
import { RoutePath } from "../../shared/config/RouteConfig";
import Home from "../../shared/assets/home.svg";
import HomeActive from "../../shared/assets/homeActive.svg";
import Search from "../../shared/assets/search.svg";
import SearchActive from "../../shared/assets/searchActive.svg";
import Explore from "../../shared/assets/explore.svg";
import ExploreActive from "../../shared/assets/exploreActive.svg";
import Messages from "../../shared/assets/messages.svg";
import MessagesActive from "../../shared/assets/messagesActive.svg";
import Notifications from "../../shared/assets/notifications.svg";
import NotificationsActive from "../../shared/assets/notificationsActive.svg";
import Create from "../../shared/assets/create.svg";
import CreateActive from "../../shared/assets/createActive.png";
import { useEffect, useState } from "react";
import { CreateModal } from "../../features/createModal/ui/createModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store/store";
import { fetchProfile } from "../../entities/Profile/model/profileSlice";
import type { DrawerType } from "../../app/layouts/AuthLayout";

interface SidebarProps {
  activeDrawer: DrawerType;
  onOpenDrawer: (drawer: "search" | "notifications") => void;
}
function Sidebar({ activeDrawer, onOpenDrawer }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isSearchOpen = activeDrawer === "search";

  const isNotificationsOpen = activeDrawer === "notifications";
  const isAnyDrawerOpen = activeDrawer !== null;
  const myProfile = useSelector((state: RootState) => state.profile.myProfile);
  const firstLetter = myProfile?.user?.username?.slice(0, 1).toUpperCase();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !myProfile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, myProfile]);
  return (
    <div className={cls.sidebar}>
      <img src={Ichgram} alt="IchGram" className={cls.logo} />
      <nav className={cls.navbar}>
        <div className={cls.link_block}>
          <NavLink
            to={RoutePath.home}
            end
            className={({ isActive }) =>
              `${cls.link} ${isActive && !isAnyDrawerOpen ? cls.active : ""}`
            }
          >
            {({ isActive }) => (
              <div className={cls.link_content}>
                <img
                  src={isActive && !isAnyDrawerOpen ? HomeActive : Home}
                  alt="Home"
                  className={cls.fivicone}
                />
                <span>Home</span>
              </div>
            )}
          </NavLink>
        </div>
        <div className={cls.link_block}>
          <button
            type="button"
            className={`${cls.link} ${isSearchOpen ? cls.active : ""}`}
            onClick={() => onOpenDrawer("search")}
          >
            <div className={cls.link_content}>
              <img
                src={isSearchOpen ? SearchActive : Search}
                alt="Search"
                className={cls.fivicone}
              />

              <span>Search</span>
            </div>
          </button>
        </div>
        <div className={cls.link_block}>
          <NavLink
            to={RoutePath.explore}
            className={({ isActive }) =>
              `${cls.link} ${isActive && !isAnyDrawerOpen ? cls.active : ""}`
            }
          >
            {({ isActive }) => (
              <div className={cls.link_content}>
                <img
                  src={isActive && !isAnyDrawerOpen ? ExploreActive : Explore}
                  alt="Search"
                  className={cls.fivicone}
                />
                <span>Explore</span>
              </div>
            )}
          </NavLink>
        </div>

        <div className={cls.link_block}>
          <NavLink
            to={RoutePath.messages}
            className={({ isActive }) =>
              `${cls.link} ${isActive && !isAnyDrawerOpen ? cls.active : ""}`
            }
          >
            {({ isActive }) => (
              <div className={cls.link_content}>
                <img
                  src={isActive && !isAnyDrawerOpen ? MessagesActive : Messages}
                  alt="Search"
                  className={cls.fivicone}
                />
                <span>Messages</span>
              </div>
            )}
          </NavLink>
        </div>
        <div className={cls.link_block}>
          <button
            type="button"
            className={`${cls.link} ${isNotificationsOpen ? cls.active : ""}`}
            onClick={() => onOpenDrawer("notifications")}
          >
            <div className={cls.link_content}>
              <img
                src={isNotificationsOpen ? NotificationsActive : Notifications}
                alt="Notifications"
                className={cls.fivicone}
              />

              <span>Notifications</span>
            </div>
          </button>
        </div>
        <div className={cls.link_block}>
          <button
            type="button"
            className={`${cls.link} ${isOpen ? cls.active : ""}`}
            onClick={() => setIsOpen(true)}
          >
            <div className={cls.link_content}>
              <img
                src={isOpen ? CreateActive : Create}
                alt="Create"
                className={cls.fivicone}
              />

              <span>Create</span>
            </div>
          </button>
        </div>
      </nav>
      <div className={cls.link_block_image}>
        {myProfile?.avatarUrl ? (
          <img
            src={myProfile?.avatarUrl}
            alt="Selfie"
            className={cls.fivicone_selfie}
          />
        ) : (
          <div className={cls.circle}>
            <span className={cls.letter}>{firstLetter}</span>
          </div>
        )}

        <NavLink
          to={RoutePath.profile}
          end
          className={({ isActive }) =>
            `${cls.link} ${isActive && !isAnyDrawerOpen ? cls.active : ""}`
          }
        >
          Profile
        </NavLink>
      </div>
      {isOpen && myProfile && (
        <CreateModal profile={myProfile} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default Sidebar;
