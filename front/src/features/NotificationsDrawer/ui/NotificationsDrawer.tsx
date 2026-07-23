import { useDispatch, useSelector } from "react-redux";
import { Drawer } from "../../../shared/UI/Drawer/Drawer";
import cls from "./NotoficationsDrawer.module.css";
import type { AppDispatch, RootState } from "../../../app/store/store";
import { useEffect } from "react";
import { getNotifications } from "../../../entities/Notification/model/notificationSlice";
import { formatDistanceToNow } from "date-fns";

interface NotificationsDrawerProps {
  onClose: () => void;
}

export const NotificationsDrawer = ({ onClose }: NotificationsDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notifications,
  );

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);
  return (
    <Drawer title="Notifications" onClose={onClose}>
      <div className={cls.notifications}>
        {loading && <p className={cls.empty}>Loading...</p>}

        {error && <p className={cls.empty}>{error}</p>}
        <h3>New</h3>
        {!loading && !error && notifications.length === 0 && (
          <p className={cls.empty}>You have no notifications yet</p>
        )}
      </div>
      {!loading &&
        !error &&
        notifications.map((notification) => (
          <div key={notification._id} className={cls.notificationItem}>
            <div className={cls.avatar}>
              {notification.sender.avatarUrl ? (
                <img
                  src={notification.sender.avatarUrl}
                  alt={notification.sender.username}
                  className={cls.avatarImage}
                />
              ) : (
                notification.sender.username.charAt(0).toUpperCase()
              )}
            </div>

            <div className={cls.notificationContent}>
              <p>
                <strong>{notification.sender.username}</strong>{" "}
                {notification.type === "follow" && "started following you"}
                {notification.type === "like" && "liked your post"}
                {notification.type === "comment" && "commented on your post"}
              </p>

              <small>
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </small>
            </div>
            {notification.post?.image && (
              <img
                src={notification.post.image}
                alt="Post"
                className={cls.postImage}
              />
            )}
          </div>
        ))}
    </Drawer>
  );
};
