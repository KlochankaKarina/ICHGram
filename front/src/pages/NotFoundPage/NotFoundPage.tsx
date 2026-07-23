import cls from "./NotFoundPage.module.css";
import Logo from "../../shared/assets/Logo.svg";

function RegisterPage() {
  return (
    <div className={cls.block}>
      <div className={cls.container}>
        <img src={Logo} alt="Logo" />
        <div className={cls.description}>
          <h1 className={cls.oops}>Oops! Page Not Found (404 Error)</h1>
          <p>
            We're sorry, but the page you're looking for doesn't seem to exist.
            If you typed the URL manually, please double-check the spelling. If
            you clicked on a link, it may be outdated or broken.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
