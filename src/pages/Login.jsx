import {
  useContext,
  useState
} from "react";
import {
  Eye,
  EyeOff,
  LogIn
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { login } from "../api/authApi";
import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await login(email, password);
      loginUser(response.data.user, response.data.token);
      toast.success(t("user.loginSuccess"));
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        t("user.loginFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="flex min-h-[680px] items-center justify-center bg-[#E5E1DB] px-6 py-14 dark:bg-[#151210]">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10 dark:bg-[#211C18]">
          <div className="text-center">
            <img
              src="/logo.png"
              alt=""
              className="mx-auto h-14 w-14 object-contain"
            />
            <p className="mt-2 text-lg font-bold">Woodora</p>
            <h1 className="mt-7 text-2xl font-bold">
              {t("user.welcomeBack")}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {t("user.loginDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                {t("common.email")}
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="name@example.com"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] focus:ring-2 focus:ring-amber-100 dark:border-stone-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                {t("common.password")}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-12 outline-none focus:border-[#A98252] focus:ring-2 focus:ring-amber-100 dark:border-stone-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={t("user.togglePassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <LogIn size={18} />
              {loading ? t("common.loading") : t("common.login")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            {t("user.noAccount")}{" "}
            <Link
              to="/register"
              className="font-semibold text-[#A98252] hover:underline"
            >
              {t("common.register")}
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}

export default Login;
