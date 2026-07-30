import {
  Fragment,
  useContext
} from "react";
import {
  Pencil,
  Trash2,
  UserRound
} from "lucide-react";

import LanguageContext
  from "../../context/LanguageContext";
import AccountForm from "./AccountForm";

const STATUS_CLASSES = {
  active: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  locked: "bg-red-50 text-red-700"
};

function AccountList({
  accounts,
  onEdit,
  onDelete,
  selectedAccount,
  onSubmit,
  onCancel,
  submitting,
  labels
}) {
  const {
    t,
    language
  } = useContext(LanguageContext);

  const formatDateTime = (value) => {
    if (!value) {
      return "N/A";
    }

    return new Date(value).toLocaleString(
      language === "vi" ? "vi-VN" : "en-US"
    );
  };

  if (!accounts?.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <UserRound size={26} />
        </div>

        <h3 className="font-semibold text-slate-900">
          {t("common.noData")}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {labels.accountDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <th className="w-[30%] px-6 py-4 font-semibold">
              {labels.account}
            </th>

            <th className="w-[22%] px-6 py-4 font-semibold">
              {t("common.role")} / {labels.status}
            </th>

            <th className="w-[30%] px-6 py-4 font-semibold">
              {labels.loginHistory}
            </th>

            <th className="w-[18%] px-6 py-4 text-right font-semibold">
              {t("common.actions")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {accounts.map((account) => (
            <Fragment key={account.id}>
              <tr
                className="
                  transition-colors
                  duration-200
                  hover:bg-[#F7F0E6]
                  hover:shadow-[inset_3px_0_0_#A98252]
                  dark:hover:bg-[#2B241F]
                "
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600">
                      {account.fullname.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {account.fullname}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {account.email}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        ID: #{account.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize text-slate-700">
                      {labels.roles[account.role] || account.role}
                    </span>

                    <span
                      className={[
                        "block w-fit rounded-full px-3 py-1 text-sm font-medium",
                        STATUS_CLASSES[account.status] ||
                          "bg-slate-100 text-slate-700"
                      ].join(" ")}
                    >
                      {labels.statuses[account.status] ||
                        account.status}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    <p>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {labels.lastLogin}:
                      </span>{" "}
                      {formatDateTime(account.lastLoginAt)}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {labels.lastLogout}:
                      </span>{" "}
                      {formatDateTime(account.lastLogoutAt)}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {account.note || labels.noNote}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(account)}
                      title={t("common.edit")}
                      aria-label={`${t("common.edit")} ${account.fullname}`}
                      className="
                        inline-flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-slate-600
                        transition
                        hover:border-[#A98252]
                        hover:bg-[#F1E6D7]
                        hover:text-[#7A5A35]
                        dark:border-stone-700
                        dark:text-stone-300
                        dark:hover:border-[#C5A26B]
                        dark:hover:bg-[#2B241F]
                        dark:hover:text-[#C5A26B]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-amber-200
                      "
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(account.id)}
                      title={t("common.delete")}
                      aria-label={`${t("common.delete")} ${account.fullname}`}
                      className="
                        inline-flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-slate-600
                        transition
                        hover:border-red-300
                        hover:bg-red-50
                        hover:text-red-700
                        dark:border-stone-700
                        dark:text-stone-300
                        dark:hover:border-red-700
                        dark:hover:bg-red-950/40
                        dark:hover:text-red-300
                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-200
                      "
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>

              {selectedAccount?.id === account.id && (
                <tr>
                  <td
                    colSpan="4"
                    className="bg-slate-50 px-4 py-5 dark:bg-slate-950/70"
                  >
                    <div className="mx-auto max-w-3xl rounded-2xl border border-[#A98252]/40 bg-white p-6 shadow-sm dark:border-[#C5A26B]/50 dark:bg-slate-900">
                      <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {labels.editAccount}: {account.fullname}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {labels.formDescription}
                        </p>
                      </div>
                      <AccountForm
                        key={selectedAccount.id}
                        selectedAccount={selectedAccount}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitting={submitting}
                        labels={labels}
                      />
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
