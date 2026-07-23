export interface CommentUser {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  avatarUrl?: string;
}

export interface Comment {
  _id: string;
  post: string;
  user: CommentUser;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  postId: string;
  text: string;
}