import {
  useContext,
  useState
} from "react";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { register } from "../api/authApi";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Register() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({
    fullname: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error(t("user.passwordMismatch"));
      return;
    }

    try {
      setLoading(true);
      await register({
        fullname: form.fullname,
        gender: form.gender,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      toast.success(t("user.registerSuccess"));
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        t("user.registerFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="flex min-h-[760px] items-center justify-center bg-[#E5E1DB] px-6 py-14 dark:bg-[#151210]">
        <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-xl sm:p-10 dark:bg-[#211C18]">
          <div className="text-center">
            <img
              src="/logo.png"
              alt=""
              className="mx-auto h-14 w-14 object-contain"
            />
            <p className="mt-2 text-lg font-bold">Woodora</p>
            <h1 className="mt-6 text-2xl font-bold">
              {t("user.createAccount")}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {t("user.registerDescription")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid gap-4 sm:grid-cols-2"
          >
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium">
                {t("common.fullName")} *
              </span>
              <input
                name="fullname"
                value={form.fullname}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">
                {t("user.gender")}
              </span>
              <select
                name="gender"
                value={form.gender}
                onChange={updateField}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
              >
                <option value="">{t("user.selectGender")}</option>
                <option value="male">{t("user.male")}</option>
                <option value="female">{t("user.female")}</option>
                <option value="other">{t("user.other")}</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">
                {t("common.phone")}
              </span>
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium">
                {t("common.email")} *
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">
                {t("common.password")} *
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                required
                minLength="6"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">
                {t("user.confirmPassword")} *
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={updateField}
                required
                minLength="6"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white sm:col-span-2"
            >
              <UserPlus size={18} />
              {loading ? t("common.loading") : t("user.createAccount")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            {t("user.haveAccount")}{" "}
            <Link
              to="/login"
              className="font-semibold text-[#A98252] hover:underline"
            >
              {t("common.login")}
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}

export default Register;
