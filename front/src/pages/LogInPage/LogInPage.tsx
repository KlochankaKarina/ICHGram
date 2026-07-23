import cls from "./LogInPage.module.css";
import Logo from "../../shared/assets/Logo.svg";
import Ichgram from "../../shared/assets/ICHGRA 2.svg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppRoutes, RoutePath } from "../../shared/config/RouteConfig";
import { login } from "../../entities/User/api/api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store/store";
import { setAuthData } from "../../entities/User/model/userSlice";
import axios from "axios";

function LogInPage() {
  const dispatch = useDispatch<AppDispatch>();

  type FormValues = {
    email: string;
    password: string;
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({ mode: "onChange" });

  const navigate = useNavigate();

  async function onHandleSubmit(data: FormValues) {
    try {
      const response = await login(data.email, data.password);
      const loginData = response.data;
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));
      dispatch(setAuthData(loginData));
      navigate(RoutePath[AppRoutes.PROFILE]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("root", {
          type: "server",
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    }
  }

  function registration() {
    navigate(RoutePath[AppRoutes.REGISTRATION]);
  }

  return (
    <div className={cls.content}>
      <img src={Logo} alt="Logo" className={cls.logo} />
      <div className={cls.form}>
        <div className={cls.form_content}>
          <img src={Ichgram} alt="Ichgram" className={cls.ichgram} />
          <form
            className={cls.formchen}
            onSubmit={handleSubmit(onHandleSubmit)}
          >
            <div className={cls.inputs}>
              <input
                type="text"
                placeholder="Username, or email"
                className={cls.input}
                {...register("email", {
                  required: "Username or Email is required",
                })}
              />
              {errors.email && (
                <span className={cls.errors}>{errors.email.message}</span>
              )}
              <input
                type="text"
                placeholder="Password"
                className={cls.input}
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (value.length < 3)
                      return "Password should contain more than 3 symbols";
                    if (value.length > 15) return "Maximal 15 symbols";
                    return true;
                  },
                })}
              />
              {errors.password && (
                <span className={cls.errors}>{errors.password.message}</span>
              )}
              {errors.root && (
                <span className={cls.errors}>{errors.root.message}</span>
              )}
            </div>
            <button
              className={cls.login_btn}
              disabled={!isValid || isSubmitting}
            >
              Log in
            </button>
          </form>
          <div className={cls.or_block}>
            <div className={cls.linien}></div>
            <span className={cls.or}>or</span>
            <div className={cls.linien}></div>
          </div>
          <a className={cls.forgot}>Forgot password?</a>
        </div>

        <div className={cls.sign_up}>
          <span>Don't have an account?</span>
          <button className={cls.btn} onClick={registration}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
