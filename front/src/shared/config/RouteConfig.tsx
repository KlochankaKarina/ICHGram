import LogInPage from "../../pages/LogInPage/LogInPage.tsx";
import RegisterPage from "../../pages/RegisterPage/RegisterPage.tsx";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage.tsx";
import ProfilePage from "../../pages/ProfilePage/ProfilePage.tsx";
import RequireAuth from "../../app/providers/router/RequireAuth.tsx";
import HomePage from "../../pages/subPages/HomePage/HomePage.tsx";
import AuthLayout from "../../app/layouts/AuthLayout.tsx";
import EditPage from "../../pages/EditPage/EditPage.tsx";
import ExplorePage from "../../pages/subPages/ExplorePage/ExplorePage.tsx";
import MessagesPage from "../../pages/subPages/MessagesPage/MessagesPage.tsx";

export const AppRoutes = {
  MAIN: "main",
  REGISTRATION: "registration",
  PROFILE: "profile",
  USER_PROFILE: "user_profile",
  HOME: "home",
  EDIT: "edit",
  EXPLORE: "explore",
  MESSAGES: "messages",
  NOT_FOUND: "not_found",
};

export const RoutePath = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.REGISTRATION]: "/registration",
  [AppRoutes.PROFILE]: "/profile",
  [AppRoutes.USER_PROFILE]: "/users/:username",
  [AppRoutes.HOME]: "/profile/home",
  [AppRoutes.EDIT]: "/profile/edit",
  [AppRoutes.EXPLORE]: "/profile/explore",
  [AppRoutes.MESSAGES]: "/profile/messages",
  [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig = {
  [AppRoutes.MAIN]: {
    path: RoutePath[AppRoutes.MAIN],
    element: <LogInPage />,
  },
  [AppRoutes.REGISTRATION]: {
    path: RoutePath[AppRoutes.REGISTRATION],
    element: <RegisterPage />,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePath[AppRoutes.PROFILE],
    element: (
      <RequireAuth>
        <AuthLayout>
          <ProfilePage />
        </AuthLayout>
      </RequireAuth>
    ),
  },
  [AppRoutes.USER_PROFILE]: {
    path: RoutePath[AppRoutes.USER_PROFILE],
    element: (
      <RequireAuth>
        <AuthLayout>
          <ProfilePage />
        </AuthLayout>
      </RequireAuth>
    ),
  },
  [AppRoutes.HOME]: {
    path: RoutePath[AppRoutes.HOME],
    element: (
      <RequireAuth>
        <AuthLayout>
          <HomePage />
        </AuthLayout>
      </RequireAuth>
    ),
  },
  [AppRoutes.EDIT]: {
    path: RoutePath[AppRoutes.EDIT],
    element: (
      <RequireAuth>
        <AuthLayout>
          <EditPage />
        </AuthLayout>
      </RequireAuth>
    ),
  },
  [AppRoutes.EXPLORE]: {
    path: RoutePath[AppRoutes.EXPLORE],
    element: (
      <RequireAuth>
        <AuthLayout>
          <ExplorePage />
        </AuthLayout>
      </RequireAuth>
    ),
  },
  [AppRoutes.MESSAGES]: {
    path: RoutePath[AppRoutes.MESSAGES],
    element: (
      <RequireAuth>
        <AuthLayout>
          <MessagesPage />
        </AuthLayout>
      </RequireAuth>
    ),
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath[AppRoutes.NOT_FOUND],
    element: <NotFoundPage />,
  },
};
