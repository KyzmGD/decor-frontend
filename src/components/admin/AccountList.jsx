import { Fragment, useContext } from "react";
import { Pencil, UserRound } from "lucide-react";

import LanguageContext from "../../context/LanguageContext";
import AccountForm from "./AccountForm";

function AccountList({
  accounts,
  onView,
  selectedAccount,
  onSubmit,
  onCancel,
  submitting,
  labels
}) {
  const { t, language } = useContext(LanguageContext);
  const formatDateTime = (value) => value
    ? new Date(value).toLocaleString(language === "vi" ? "vi-VN" : "en-US")
    : labels.neverLoggedIn;

  if (!accounts?.length) {
    return <div className="flex flex-col items-center px-6 py-16 text-center text-slate-500"><UserRound size={30} /><p className="mt-3">{t("common.noData")}</p></div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700">
            <th className="w-[32%] px-6 py-4 font-semibold">{labels.account}</th>
            <th className="w-[20%] px-6 py-4 font-semibold">{labels.permission}</th>
            <th className="w-[30%] px-6 py-4 font-semibold">{labels.lastLogin}</th>
            <th className="w-[18%] px-6 py-4 text-right font-semibold">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {accounts.map((account) => (
            <Fragment key={account.id}>
              <tr className="transition-colors hover:bg-[#F7F0E6] dark:hover:bg-[#2B241F]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {account.avatar ? (
                      <img src={account.avatar} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                        {account.fullname?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">{account.fullname}</p>
                      <p className="truncate text-xs text-slate-400">{account.email}</p>
                      <p className="text-xs text-slate-400">ID: #{account.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{labels.roles[account.role]}</span></td>
                <td className="px-6 py-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <p>{formatDateTime(account.lastLoginAt)}</p>
                  {account.phone && <p className="text-xs text-slate-400">{t("common.phone")}: {account.phone}</p>}
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => onView(account)} title={labels.viewAccount} aria-label={`${labels.viewAccount} ${account.fullname}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#A98252] hover:bg-[#F1E6D7] hover:text-[#7A5A35] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><Pencil size={16} /></button>
                </td>
              </tr>
              {selectedAccount?.id === account.id && (
                <tr>
                  <td colSpan="4" className="bg-slate-50 px-4 py-5 dark:bg-slate-950/70">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-[#A98252]/40 bg-white p-6 shadow-sm dark:bg-slate-900">
                      <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">{labels.viewAccount}: {selectedAccount.fullname}</h3>
                      <AccountForm key={`${selectedAccount.id}-${selectedAccount.role}`} selectedAccount={selectedAccount} onSubmit={onSubmit} onCancel={onCancel} submitting={submitting} labels={labels} />
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountList;
