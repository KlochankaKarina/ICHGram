import type { Profile } from "../../Profile/model/types";

export interface Post {
  _id: string;
  image: string;
  imagePublicId: string;
  caption: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostModalProps {
  post: Post | null;
  profile: Profile;
  onClose: () => void;
  onDeleted: () => void;
  isOwnProfile: boolean;
}

export interface PostActionsModalProps {
  post: Post | null;
  profile: Profile;
  onClose: () => void;
  onDeleted: () => void;
}
