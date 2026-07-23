import { Suspense, useCallback, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { routeConfig } from "../../../shared/config/RouteConfig.tsx";
import PageLoader from "../../../shared/UI/PageLoader/PageLoader";

type AppRoute = {
  path: string;
  element: ReactNode;
};

const AppRouter = () => {
  const renderWithWrapper = useCallback((route: AppRoute) => {
    const element = (
      <Suspense fallback={<PageLoader />}>{route.element}</Suspense>
    );
    return <Route key={route.path} path={route.path} element={element} />;
  }, []);

  return <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>;
};

export default AppRouter;
