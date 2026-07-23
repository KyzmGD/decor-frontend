import {
  useContext,
  useState
} from "react";
import {
  MapPin,
  Save,
  UserRound
} from "lucide-react";
import toast from "react-hot-toast";

import {
  updateProfile as updateProfileApi
} from "../api/authApi";
import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Profile() {
  const {
    user,
    token,
    updateUser
  } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    city: user?.city || "",
    district: user?.district || "",
    address: user?.address || ""
  });
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const response = await updateProfileApi(
        {
          fullname: form.fullname,
          gender: form.gender,
          phone: form.phone,
          city: form.city,
          district: form.district,
          address: form.address
        },
        token
      );

      updateUser(response.data);
      setForm((current) => ({
        ...current,
        ...response.data
      }));
      toast.success(t("user.profileUpdated"));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        t("user.profileUpdateError")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
            Woodora Account
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            {t("common.profile")}
          </h1>
          <p className="mt-3 text-stone-500">
            {t("user.profileDescription")}
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl bg-[#2B241F] p-7 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A98252] text-2xl font-bold">
              {(user?.fullname || "U").charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-5 text-xl font-bold">
              {user?.fullname}
            </h2>
            <p className="mt-1 break-all text-sm text-stone-300">
              {user?.email}
            </p>
            <div className="mt-6 border-t border-white/15 pt-5 text-sm">
              <p className="text-stone-400">{t("common.role")}</p>
              <p className="mt-1 capitalize">{user?.role}</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-700 dark:bg-stone-900">
              <div className="flex items-center gap-3">
                <UserRound size={22} className="text-[#A98252]" />
                <h2 className="text-xl font-bold">
                  {t("user.personalInformation")}
                </h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-medium">
                    {t("common.fullName")}
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
                    {t("common.email")}
                  </span>
                  <input
                    value={form.email}
                    disabled
                    className="w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-stone-500 dark:border-stone-700 dark:bg-stone-800"
                  />
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
              </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-700 dark:bg-stone-900">
              <div className="flex items-center gap-3">
                <MapPin size={22} className="text-[#A98252]" />
                <h2 className="text-xl font-bold">
                  {t("user.defaultShippingAddress")}
                </h2>
              </div>
              <p className="mt-2 text-sm text-stone-500">
                {t("user.checkoutAutofillHint")}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-medium">
                    {t("user.city")}
                  </span>
                  <input
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-medium">
                    {t("user.district")}
                  </span>
                  <input
                    name="district"
                    value={form.district}
                    onChange={updateField}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium">
                    {t("user.addressDetail")}
                  </span>
                  <input
                    name="address"
                    value={form.address}
                    onChange={updateField}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                  />
                </label>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? t("common.loading") : t("common.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;
