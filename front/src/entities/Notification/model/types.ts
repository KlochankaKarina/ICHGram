export interface NotificationSender {
  _id: string;
  username: string;
  fullname: string;
  avatarUrl?: string;
}

export interface NotificationPost {
  _id: string;
  image: string;
}

export interface Notification {
  _id: string;
  receiver: string;
  sender: NotificationSender;
  type: "follow" | "like" | "comment";
  post?: NotificationPost | null;
  comment?: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}