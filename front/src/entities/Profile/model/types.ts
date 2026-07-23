export interface Profile {
  _id: string;
  bio: string;
  website: string;
  avatarUrl: string;
  followers: string[];
  following: string[];
  isFollowing?: boolean;
  user: {
    _id: string;
    username: string;
    fullname: string;
    email: string;
  };
}
