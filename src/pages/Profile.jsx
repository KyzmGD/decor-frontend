import {
  useContext,
  useState
} from "react";
import {
  MapPin,
  Save,
  Upload,
  UserRound
} from "lucide-react";
import toast from "react-hot-toast";

import {
  updateProfile as updateProfileApi
} from "../api/authApi";
import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Willow",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Oliver",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Mia",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Max"
];

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
    address: user?.address || "",
    avatar: user?.avatar || ""
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
          address: form.address,
          avatar: form.avatar
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

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t("user.avatarImageOnly"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const sourceImage = new Image();
      sourceImage.onload = () => {
        const maxSize = 320;
        const scale = Math.min(
          maxSize / sourceImage.width,
          maxSize / sourceImage.height,
          1
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(
          1,
          Math.round(sourceImage.width * scale)
        );
        canvas.height = Math.max(
          1,
          Math.round(sourceImage.height * scale)
        );
        canvas
          .getContext("2d")
          .drawImage(
            sourceImage,
            0,
            0,
            canvas.width,
            canvas.height
          );

        setForm((current) => ({
          ...current,
          avatar: canvas.toDataURL("image/jpeg", 0.82)
        }));
      };
      sourceImage.src = reader.result;
    };
    reader.readAsDataURL(file);
    event.target.value = "";
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
            {form.avatar ? (
              <img
                src={form.avatar}
                alt=""
                className="h-20 w-20 rounded-full border-2 border-white/30 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#A98252] text-2xl font-bold">
                {(user?.fullname || "U").charAt(0).toUpperCase()}
              </div>
            )}
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
                  {t("user.profilePicture")}
                </h2>
              </div>
              <p className="mt-2 text-sm text-stone-500">
                {t("user.profilePictureHint")}
              </p>

              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt=""
                    className="h-28 w-28 shrink-0 rounded-full border-4 border-[#EDE6DC] object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#EDE6DC] text-3xl font-bold text-[#7A5A35]">
                    {(form.fullname || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="mb-3 text-sm font-semibold">
                    {t("user.choosePresetAvatar")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            avatar
                          }))
                        }
                        className={`rounded-full border-2 p-0.5 ${
                          form.avatar === avatar
                            ? "border-[#A98252]"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={avatar}
                          alt=""
                          className="h-11 w-11 rounded-full bg-stone-100"
                        />
                      </button>
                    ))}
                  </div>

                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:border-[#A98252] hover:text-[#7A5A35] dark:border-stone-600">
                    <Upload size={17} />
                    {t("user.uploadOwnAvatar")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </section>

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
