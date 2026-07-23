// import { useState, type ReactNode } from "react";
// import Sidebar from "../../widgets/sidebar/Sidebar";
// import { SearchDrawer } from "../../features/searchDrawer/ui/SearchDrawer";
// import cls from "./AuthLayout.module.css";

// interface AuthLayoutProps {
//   children: ReactNode;
// }

// const AuthLayout = ({ children }: AuthLayoutProps) => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);

//   const openSearch = () => {
//     setIsSearchOpen(true);
//   };

//   const closeSearch = () => {
//     setIsSearchOpen(false);
//   };

//   return (
//     <div className={cls.layout}>
//       <Sidebar
//         isSearchOpen={isSearchOpen}
//         onOpenSearch={openSearch}
//       />

//       <main className={cls.content}>
//         {children}
//       </main>

//       {isSearchOpen && (
//         <SearchDrawer onClose={closeSearch} />
//       )}
//     </div>
//   );
// };

// export default AuthLayout;

import { useState, type ReactNode } from "react";
import Sidebar from "../../widgets/sidebar/Sidebar";
import { SearchDrawer } from "../../features/searchDrawer/ui/SearchDrawer";
import { NotificationsDrawer } from "../../features/NotificationsDrawer/ui/NotificationsDrawer";
import cls from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export type DrawerType = "search" | "notifications" | null;

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  const openDrawer = (drawer: Exclude<DrawerType, null>) => {
    setActiveDrawer(drawer);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
  };

  return (
    <div className={cls.layout}>
      <Sidebar activeDrawer={activeDrawer} onOpenDrawer={openDrawer} />

      <main className={cls.content}>{children}</main>

      {activeDrawer === "search" && <SearchDrawer onClose={closeDrawer} />}

      {activeDrawer === "notifications" && (
        <NotificationsDrawer onClose={closeDrawer} />
      )}
    </div>
  );
};

export default AuthLayout;
