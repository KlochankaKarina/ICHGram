import cls from "./RegisterPage.module.css";
import Ichgram from "../../shared/assets/ICHGRA 2.svg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppRoutes, RoutePath } from "../../shared/config/RouteConfig";
import { registration } from "../../entities/User/api/api.ts";
import { useDispatch } from "react-redux";
import { setUser } from "../../entities/User/model/userSlice.ts";
import type { AppDispatch } from "../../app/store/store.ts";

function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();

  type FormValues = {
    email: string;
    fullname: string;
    username: string;
    password: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({ mode: "onChange" });

  async function onHandleSubmit(data: FormValues) {
    try {
      const response = await registration(
        data.username,
        data.fullname,
        data.email,
        data.password,
      );
      const auth = response.data;
      console.log(response.data);
      dispatch(setUser(auth));
      navigate(RoutePath[AppRoutes.MAIN]);
    } catch (err) {
      console.log(err);
    }
  }

  const navigate = useNavigate();

  function login() {
    navigate(RoutePath[AppRoutes.MAIN]);
  }

  return (
    <div className={cls.content}>
      <div className={cls.form}>
        <div className={cls.form_content}>
          <img src={Ichgram} alt="Ichgram" className={cls.ichgram} />
          <form
            id="register-form"
            className={cls.formchen}
            onSubmit={handleSubmit(onHandleSubmit)}
          >
            <div className={cls.inputs}>
              <input
                type="text"
                placeholder="Email"
                className={cls.input}
                {...register("email", {
                  required: "Email is required",
                  validate: (value) => {
                    if (!value.includes("@"))
                      return "Email should contain '@' symbol";
                    return true;
                  },
                })}
              />
              {errors.email && (
                <span className={cls.errors}>{errors.email.message}</span>
              )}
              <input
                type="text"
                placeholder="Full Name"
                className={cls.input}
                {...register("fullname", { required: "Full Name is required" })}
              />
              {errors.fullname && (
                <span className={cls.errors}>{errors.fullname.message}</span>
              )}
              <input
                type="text"
                placeholder="Username"
                className={cls.input}
                {...register("username", {
                  required: "Username is required",
                  validate: (value) => {
                    if (value.length < 3)
                      return "Username should contain more than 3 symbols";
                    if (value.length > 15) return "Maximal 15 symbols";
                    return true;
                  },
                })}
              />
              {errors.username && (
                <span className={cls.errors}>{errors.username.message}</span>
              )}
              <input
                type="text"
                placeholder="Password"
                className={cls.input}
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (value.length < 6)
                      return "Password should contain more than 6 symbols";
                    if (value.length > 15) return "Maximal 15 symbols";
                    return true;
                  },
                })}
              />
              {errors.password && (
                <span className={cls.errors}>{errors.password.message}</span>
              )}
            </div>
          </form>
          <div className={cls.bottom}>
            <p className={cls.policy}>
              People who use our service may have uploaded your contact
              information to Instagram. <a href="#">Learn More</a>
            </p>
            <p className={cls.policy}>
              By signing up, you agree to our <a href="#">Terms, </a>
              <a href="#">Privacy, </a>
              <a href="#">Policy </a>and <a href="#">Cookies Policy.</a>
            </p>
            <button
              type="submit"
              form="register-form"
              className={cls.sign_btn}
              disabled={!isValid || isSubmitting}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className={cls.sign_up}>
          <span>Have an account?</span>
          <button className={cls.btn} onClick={login}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
