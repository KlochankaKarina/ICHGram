import axios from "axios";

export interface IUser {
  id: number | string;
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  token: string;
  user: IUser;
}

export interface ISearchUser {
  _id: string;
  username: string;
  fullname: string;
  avatarUrl: string;
}

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export function registration(
  username: string,
  fullname: string,
  email: string,
  password: string,
) {
  return api.post<IUser>("/auth/register", {
    username,
    fullname,
    email,
    password,
  });
}

export function login(email: string, password: string) {
  return api.post<IUserResponse>("/auth/login", { email, password });
}

export function getProfile(token: string) {
  return api.get<IUser>("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function searchUsers(query: string) {
  return api.get<ISearchUser[]>("/auth/users/search", {
    params: {
      query,
    },
  });
}
