import styles from "./PageLoader.module.css";

export const PageLoader = () => {
  return (
    <div className={styles.loaderWrap}>
      <span className={styles.loader} />
    </div>
  );
};

export default PageLoader;