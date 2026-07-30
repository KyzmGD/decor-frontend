import {
  useContext,
  useMemo,
  useState
} from "react";

import {
  Plus,
  Search,
  UserRound
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import AccountForm from "../../components/admin/AccountForm";
import AccountList from "../../components/admin/AccountList";
import LanguageContext
  from "../../context/LanguageContext";

const INITIAL_ACCOUNTS = [
  {
    id: 1001,
    fullname: "Nguyen Minh Anh",
    email: "minhanh@example.com",
    phone: "0901234567",
    role: "user",
    status: "active",
    lastLoginAt: "2026-07-30T08:20",
    lastLogoutAt: "2026-07-30T09:10",
    note: "Khach hang dang ky tu trang checkout."
  },
  {
    id: 1002,
    fullname: "Tran Bao Chau",
    email: "baochau.staff@woodora.vn",
    phone: "0912345678",
    role: "staff",
    status: "active",
    lastLoginAt: "2026-07-29T14:35",
    lastLogoutAt: "2026-07-29T18:05",
    note: "Nhan vien phu trach xac nhan don hang."
  },
  {
    id: 1003,
    fullname: "Le Quang Huy",
    email: "huy@example.com",
    phone: "0933456789",
    role: "user",
    status: "pending",
    lastLoginAt: "",
    lastLogoutAt: "",
    note: "Tai khoan moi dang cho xac minh thong tin."
  },
  {
    id: 1004,
    fullname: "Pham Linh Dan",
    email: "linhdan.admin@woodora.vn",
    phone: "0944567890",
    role: "admin",
    status: "active",
    lastLoginAt: "2026-07-30T07:45",
    lastLogoutAt: "",
    note: "Quan tri vien he thong."
  },
  {
    id: 1005,
    fullname: "Vo Gia Bao",
    email: "giabao@example.com",
    phone: "0966677889",
    role: "user",
    status: "locked",
    lastLoginAt: "2026-07-27T21:30",
    lastLogoutAt: "2026-07-27T21:42",
    note: "Khoa tam thoi do dang nhap that bai nhieu lan."
  }
];

const getLabels = (language) => {
  if (language === "en") {
    return {
      accountManagement: "Account management",
      accountDescription:
        "Manage customer accounts, staff access, login history and account status",
      searchAccount: "Search accounts...",
      addAccount: "Add account",
      editAccount: "Edit account",
      accountList: "Account list",
      accountCount: "{count} accounts",
      loadingAccounts: "Loading accounts...",
      noAccounts: "No accounts found.",
      confirmDeleteAccount:
        "Are you sure you want to delete this account?",
      account: "Account",
      status: "Status",
      loginHistory: "Login / logout history",
      lastLogin: "Last login",
      lastLogout: "Last logout",
      note: "Admin note",
      noNote: "No note",
      createAccount: "Create account",
      updateAccount: "Save changes",
      formDescription:
        "Update the role, account status and access history.",
      fullNameHint: "Example: Nguyen Minh Anh",
      phoneHint: "Example: 0901234567",
      noteHint: "Internal note for administrators...",
      duplicateEmail: "This email is already used by another account.",
      roles: {
        user: "User",
        staff: "Staff",
        admin: "Admin"
      },
      statuses: {
        active: "Active",
        pending: "Pending",
        locked: "Locked"
      }
    };
  }

  return {
    accountManagement: "Quản lý tài khoản",
    accountDescription:
      "Quản lý tài khoản khách hàng, nhân viên, lịch sử đăng nhập và trạng thái truy cập",
    searchAccount: "Tìm kiếm tài khoản...",
    addAccount: "Thêm tài khoản",
    editAccount: "Chỉnh sửa tài khoản",
    accountList: "Danh sách tài khoản",
    accountCount: "{count} tài khoản",
    loadingAccounts: "Đang tải tài khoản...",
    noAccounts: "Không tìm thấy tài khoản.",
    confirmDeleteAccount:
      "Bạn có chắc muốn xóa tài khoản này?",
    account: "Tài khoản",
    status: "Trạng thái",
    loginHistory: "Lịch sử đăng nhập / đăng xuất",
    lastLogin: "Đăng nhập gần nhất",
    lastLogout: "Đăng xuất gần nhất",
    note: "Ghi chú quản trị",
    noNote: "Chưa có ghi chú",
    createAccount: "Tạo tài khoản",
    updateAccount: "Lưu thay đổi",
    formDescription:
      "Cập nhật vai trò, trạng thái tài khoản và lịch sử truy cập.",
    fullNameHint: "Ví dụ: Nguyễn Minh Anh",
    phoneHint: "Ví dụ: 0901234567",
    noteHint: "Ghi chú nội bộ cho quản trị viên...",
    duplicateEmail: "Email này đã được sử dụng bởi tài khoản khác.",
    roles: {
      user: "Người dùng",
      staff: "Nhân viên",
      admin: "Quản trị viên"
    },
    statuses: {
      active: "Đang hoạt động",
      pending: "Chờ xác minh",
      locked: "Đã khóa"
    }
  };
};

function AdminAccounts() {
  const {
    t,
    language
  } = useContext(LanguageContext);

  const labels = useMemo(
    () => getLabels(language),
    [language]
  );

  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loading = false;

  const filteredAccounts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return accounts;
    }

    return accounts.filter((account) => {
      return (
        account.fullname.toLowerCase().includes(keyword) ||
        account.email.toLowerCase().includes(keyword) ||
        account.phone.toLowerCase().includes(keyword) ||
        labels.roles[account.role].toLowerCase().includes(keyword) ||
        labels.statuses[account.status].toLowerCase().includes(keyword)
      );
    });
  }, [
    accounts,
    labels,
    search
  ]);

  const closeForm = () => {
    setSelectedAccount(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = (data) => {
    const normalizedEmail = data.email.toLowerCase();
    const emailExists = accounts.some(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.id !== selectedAccount?.id
    );

    if (emailExists) {
      setError(labels.duplicateEmail);
      return;
    }

    setSubmitting(true);
    setError("");

    if (selectedAccount) {
      setAccounts((current) =>
        current.map((account) =>
          account.id === selectedAccount.id
            ? {
                ...account,
                ...data,
                email: normalizedEmail
              }
            : account
        )
      );
    } else {
      const nextId =
        Math.max(...accounts.map((account) => account.id)) + 1;

      setAccounts((current) => [
        {
          id: nextId,
          ...data,
          email: normalizedEmail
        },
        ...current
      ]);
    }

    setSubmitting(false);
    closeForm();
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setShowForm(true);
    setError("");
  };

  const handleDelete = (id) => {
    if (!window.confirm(labels.confirmDeleteAccount)) {
      return;
    }

    setAccounts((current) =>
      current.filter((account) => account.id !== id)
    );

    if (selectedAccount?.id === id) {
      closeForm();
    }
  };

  return (
    <AdminLayout
      title={labels.accountManagement}
      description={labels.accountDescription}
    >
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={labels.searchAccount}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              py-3
              pl-11
              pr-4
              text-slate-900
              outline-none
              transition
              focus:border-slate-900
              focus:ring-2
              focus:ring-slate-200
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-white
              dark:focus:border-slate-500
              dark:focus:ring-slate-800
            "
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedAccount(null);
            setShowForm(true);
            setError("");
          }}
          className="
            flex
            items-center
            justify-center
            i18n-toolbar-action
            gap-2
            rounded-xl
            bg-slate-900
            px-4
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[#453A32]
            hover:shadow-md
            dark:bg-white
            dark:text-slate-900
            dark:hover:bg-[#BD996B]
          "
        >
          <Plus size={18} />
          {labels.addAccount}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {showForm && !selectedAccount && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedAccount
                ? labels.editAccount
                : labels.addAccount}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-[#F7F0E6] hover:text-[#7A5A35] dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
            >
              {t("common.close")}
            </button>
          </div>

          <AccountForm
            key="new-account"
            selectedAccount={selectedAccount}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={submitting}
            labels={labels}
          />
        </div>
      )}

      <div className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-colors
        dark:border-slate-800
        dark:bg-slate-900
      ">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5">
          <div className="rounded-xl bg-slate-100 p-2.5">
            <UserRound size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              {labels.accountList}
            </h2>

            <p className="text-sm text-slate-500">
              {labels.accountCount.replace(
                "{count}",
                filteredAccounts.length
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            {labels.loadingAccounts}
          </div>
        ) : (
          <AccountList
            accounts={filteredAccounts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectedAccount={selectedAccount}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={submitting}
            labels={labels}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAccounts;
