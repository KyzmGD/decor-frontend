import { useContext, useState } from "react";
import { Save, ShieldCheck, X } from "lucide-react";

import LanguageContext from "../../context/LanguageContext";

function AccountForm({
  selectedAccount,
  onSubmit,
  onCancel,
  submitting = false,
  labels
}) {
  const { t, language } = useContext(LanguageContext);
  const [role, setRole] = useState(selectedAccount.role);
  const formattedLastLogin = selectedAccount.lastLoginAt
    ? new Date(selectedAccount.lastLoginAt).toLocaleString(
        language === "vi" ? "vi-VN" : "en-US"
      )
    : labels.neverLoggedIn;
  const formattedCreatedAt = selectedAccount.createdAt
    ? new Date(selectedAccount.createdAt).toLocaleString(
        language === "vi" ? "vi-VN" : "en-US"
      )
    : "—";
  const address = [
    selectedAccount.address,
    selectedAccount.district,
    selectedAccount.city
  ].filter(Boolean).join(", ");

  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(role); }}>
      <div className="grid gap-5 sm:grid-cols-2">
        <section className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-950">
          <h4 className="mb-4 font-bold text-slate-900 dark:text-white">{labels.accountInformation}</h4>
          <div className="space-y-3">
            <div><span className="block text-slate-500">{t("common.fullName")}</span><strong className="text-slate-900 dark:text-white">{selectedAccount.fullname}</strong></div>
            <div><span className="block text-slate-500">{t("common.email")}</span><strong className="break-all text-slate-900 dark:text-white">{selectedAccount.email}</strong></div>
            <div><span className="block text-slate-500">{labels.registeredAt}</span><strong className="text-slate-900 dark:text-white">{formattedCreatedAt}</strong></div>
          </div>
        </section>

        <section className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-950">
          <h4 className="mb-4 font-bold text-slate-900 dark:text-white">{labels.contactInformation}</h4>
          <div className="space-y-3">
            <div><span className="block text-slate-500">{t("common.phone")}</span><strong className="text-slate-900 dark:text-white">{selectedAccount.phone || "—"}</strong></div>
            <div><span className="block text-slate-500">{t("common.address")}</span><strong className="text-slate-900 dark:text-white">{address || "—"}</strong></div>
            <div><span className="block text-slate-500">{labels.lastLogin}</span><strong className="text-slate-900 dark:text-white">{formattedLastLogin}</strong></div>
          </div>
        </section>
      </div>

      <fieldset className="mt-5 rounded-xl border border-[#A98252]/40 p-4">
        <legend className="flex items-center gap-2 px-2 font-semibold text-slate-900 dark:text-white">
          <ShieldCheck size={18} /> {labels.permission}
        </legend>
        <p className="mb-4 text-sm text-slate-500">{labels.permissionDescription}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {["user", "admin"].map((value) => (
            <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${role === value ? "border-[#A98252] bg-[#F7F0E6] dark:bg-[#2B241F]" : "border-slate-200 dark:border-slate-700"}`}>
              <input type="radio" name="role" value={value} checked={role === value} onChange={() => setRole(value)} />
              <span className="font-semibold text-slate-800 dark:text-slate-100">{labels.roles[value]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={submitting} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold dark:border-slate-700 dark:text-white">
          <X size={18} /> {t("common.cancel")}
        </button>
        <button type="submit" disabled={submitting || role === selectedAccount.role} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#A98252]">
          <Save size={18} /> {submitting ? t("common.loading") : labels.savePermission}
        </button>
      </div>
    </form>
  );
}

export default AccountForm;
