import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Search, UserRound } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import AccountList from "../../components/admin/AccountList";
import AuthContext from "../../context/AuthContext";
import LanguageContext from "../../context/LanguageContext";
import {
  getAccount,
  getAccounts,
  updateAccountRole
} from "../../api/adminAccountApi";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

function AdminAccounts() {
  const { token } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const labels = useMemo(() => ({
    accountManagement: t("admin.accountManagement"),
    accountDescription: t("admin.accountDescription"),
    searchAccount: t("admin.searchAccount"),
    accountList: t("admin.accountList"),
    accountCount: t("admin.accountCount"),
    loadingAccounts: t("admin.loadingAccounts"),
    account: t("admin.account"),
    accountInformation: t("admin.accountInformation"),
    contactInformation: t("admin.contactInformation"),
    registeredAt: t("admin.registeredAt"),
    lastLogin: t("admin.lastLogin"),
    neverLoggedIn: t("admin.neverLoggedIn"),
    viewAccount: t("admin.viewAccount"),
    permission: t("admin.permission"),
    permissionDescription: t("admin.permissionDescription"),
    savePermission: t("admin.savePermission"),
    permissionUpdated: t("admin.permissionUpdated"),
    loadError: t("admin.loadAccountsError"),
    updateError: t("admin.updatePermissionError"),
    roles: {
      user: t("admin.userRole"),
      admin: t("admin.adminRole")
    }
  }), [t]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const loadAccounts = async () => {
      try {
        const response = await getAccounts(token);
        if (active) setAccounts(response.data);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError, labels.loadError));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAccounts();
    return () => { active = false; };
  }, [labels.loadError, token]);

  const filteredAccounts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return accounts;

    return accounts.filter((account) =>
      [account.fullname, account.email, labels.roles[account.role]]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [accounts, labels.roles, search]);

  const handleView = async (account) => {
    if (selectedAccount?.id === account.id) {
      setSelectedAccount(null);
      return;
    }

    setError("");
    setSuccess("");
    try {
      const response = await getAccount(account.id, token);
      setSelectedAccount(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, labels.loadError));
    }
  };

  const handleRoleChange = async (role) => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await updateAccountRole(
        selectedAccount.id,
        role,
        token
      );
      setAccounts((current) => current.map((account) =>
        account.id === response.data.id ? response.data : account
      ));
      setSelectedAccount(response.data);
      setSuccess(labels.permissionUpdated);
    } catch (requestError) {
      setError(getErrorMessage(requestError, labels.updateError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title={labels.accountManagement} description={labels.accountDescription}>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full md:max-w-md">
          <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={labels.searchAccount}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800"><UserRound size={21} /></div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">{labels.accountList}</h2>
            <p className="text-sm text-slate-500">{labels.accountCount.replace("{count}", filteredAccounts.length)}</p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">{labels.loadingAccounts}</div>
        ) : (
          <AccountList
            accounts={filteredAccounts}
            selectedAccount={selectedAccount}
            onView={handleView}
            onSubmit={handleRoleChange}
            onCancel={() => setSelectedAccount(null)}
            submitting={submitting}
            labels={labels}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAccounts;
