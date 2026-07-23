import type { ReactNode } from "react";
import cls from "./Drawer.module.css";

interface DrawerProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const Drawer = ({ title, children, onClose }: DrawerProps) => {
  return (
    <>
      <div className={cls.overlay} onClick={onClose} aria-hidden="true" />

      <aside className={cls.drawer}>
        <h2 className={cls.title}>{title}</h2>

        <div className={cls.content}>{children}</div>
      </aside>
    </>
  );
};
