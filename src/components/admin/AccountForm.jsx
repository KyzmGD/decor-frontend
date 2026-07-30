import {
  useContext,
  useState
} from "react";
import {
  Save,
  X
} from "lucide-react";

import LanguageContext from "../../context/LanguageContext";

const inputClasses =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98252] focus:ring-2 focus:ring-[#A98252]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

const getInitialForm = (account) => ({
  fullname: account?.fullname || "",
  email: account?.email || "",
  phone: account?.phone || "",
  role: account?.role || "user",
  status: account?.status || "active",
  lastLoginAt: account?.lastLoginAt || "",
  lastLogoutAt: account?.lastLogoutAt || "",
  note: account?.note || ""
});

function AccountForm({
  selectedAccount,
  onSubmit,
  onCancel,
  submitting = false,
  labels
}) {
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState(() =>
    getInitialForm(selectedAccount)
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      fullname: form.fullname.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      note: form.note.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        {t("admin.requiredFields")}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.fullName")} <span className="text-red-500">*</span>
          </span>
          <input
            required
            autoFocus
            value={form.fullname}
            onChange={(event) =>
              updateField("fullname", event.target.value)
            }
            placeholder={labels.fullNameHint}
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.email")} <span className="text-red-500">*</span>
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            placeholder="name@example.com"
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.phone")}
          </span>
          <input
            value={form.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            placeholder={labels.phoneHint}
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.role")} <span className="text-red-500">*</span>
          </span>
          <select
            required
            value={form.role}
            onChange={(event) =>
              updateField("role", event.target.value)
            }
            className={inputClasses}
          >
            <option value="user">{labels.roles.user}</option>
            <option value="staff">{labels.roles.staff}</option>
            <option value="admin">{labels.roles.admin}</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {labels.status} <span className="text-red-500">*</span>
          </span>
          <select
            required
            value={form.status}
            onChange={(event) =>
              updateField("status", event.target.value)
            }
            className={inputClasses}
          >
            <option value="active">{labels.statuses.active}</option>
            <option value="pending">{labels.statuses.pending}</option>
            <option value="locked">{labels.statuses.locked}</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {labels.lastLogin}
          </span>
          <input
            type="datetime-local"
            value={form.lastLoginAt}
            onChange={(event) =>
              updateField("lastLoginAt", event.target.value)
            }
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {labels.lastLogout}
          </span>
          <input
            type="datetime-local"
            value={form.lastLogoutAt}
            onChange={(event) =>
              updateField("lastLogoutAt", event.target.value)
            }
            className={inputClasses}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {labels.note}
          </span>
          <textarea
            rows="4"
            value={form.note}
            onChange={(event) =>
              updateField("note", event.target.value)
            }
            placeholder={labels.noteHint}
            className={`${inputClasses} resize-y`}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <X size={18} />
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#A98252] dark:hover:bg-[#BD996B]"
        >
          <Save size={18} />
          {submitting
            ? t("common.loading")
            : selectedAccount
              ? labels.updateAccount
              : labels.createAccount}
        </button>
      </div>
    </form>
  );
}

export default AccountForm;
