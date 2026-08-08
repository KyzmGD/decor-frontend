import {
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import {
  CheckCircle2,
  Clock3,
  Copy,
  Landmark,
  ReceiptText
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import { getMyTransactions } from "../api/paymentApi";
import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";
import { formatCurrency, formatVnd } from "../utils/currency";

const statusClasses = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  CANCELLED: "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200",
  REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
};

function TransactionHistory() {
  const { token } = useContext(AuthContext);
  const { t, language } = useContext(LanguageContext);
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedId = Number(searchParams.get("transaction"));

  const loadTransactions = useCallback(async ({ quiet = false } = {}) => {
    try {
      const response = await getMyTransactions(token);
      setTransactions(response.data || []);
    } catch (error) {
      if (!quiet) {
        toast.error(
          error.response?.data?.message ||
          t("user.loadTransactionsError")
        );
      }
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [t, token]);

  useEffect(() => {
    Promise.resolve().then(loadTransactions);
  }, [loadTransactions]);

  useEffect(() => {
    if (!transactions.some((item) => item.status === "PENDING")) {
      return undefined;
    }

    const interval = window.setInterval(
      () => loadTransactions({ quiet: true }),
      8000
    );

    return () => window.clearInterval(interval);
  }, [loadTransactions, transactions]);

  const copyValue = async (value) => {
    await navigator.clipboard.writeText(String(value));
    toast.success(t("user.copied"));
  };

  const statusLabel = (status) =>
    t(`user.paymentStatus${status}`);

  if (loading) {
    return (
      <MainLayout>
        <p className="py-24 text-center">{t("common.loading")}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
            Woodora Account
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            {t("user.transactionHistory")}
          </h1>
          <p className="mt-3 text-stone-500">
            {t("user.transactionHistoryDescription")}
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white py-20 text-center dark:border-stone-700 dark:bg-stone-900">
            <ReceiptText size={42} className="mx-auto text-stone-300" />
            <p className="mt-5 font-semibold">
              {t("user.noTransactions")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((transaction) => {
              const isSelected = selectedId === transaction.id;
              const isPending = transaction.status === "PENDING";

              return (
                <article
                  key={transaction.id}
                  className={`overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-stone-900 ${
                    isSelected
                      ? "border-[#A98252] ring-2 ring-[#A98252]/20"
                      : "border-stone-200 dark:border-stone-700"
                  }`}
                >
                  <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 p-6 dark:border-stone-700">
                    <div>
                      <p className="text-sm text-stone-500">
                        {t("user.order")} #{transaction.orderId}
                      </p>
                      <h2 className="mt-1 text-xl font-bold">
                        {transaction.reference}
                      </h2>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[transaction.status] || statusClasses.PENDING}`}>
                      {statusLabel(transaction.status)}
                    </span>
                  </header>

                  <div className={`grid gap-8 p-6 ${isPending ? "md:grid-cols-[320px_1fr]" : ""}`}>
                    {isPending && (
                      <div className="mx-auto w-full max-w-80 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-700 md:max-w-none">
                        <img
                          src={transaction.qrCodeUrl}
                          alt={t("user.paymentQrAlt")}
                          className="mx-auto aspect-square w-full object-contain"
                        />
                        <p className="mt-2 text-center text-xs text-stone-500">
                          {t("user.scanQrInstruction")}
                        </p>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        {transaction.status === "PAID" ? (
                          <CheckCircle2 size={20} className="text-emerald-600" />
                        ) : (
                          <Clock3 size={20} className="text-amber-600" />
                        )}
                        <p className="font-semibold">
                          {isPending
                            ? t("user.waitingForPayment")
                            : statusLabel(transaction.status)}
                        </p>
                      </div>

                      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                        {[
                          [t("user.receivingBank"), transaction.bankName],
                          [t("user.accountHolder"), transaction.accountName],
                          [t("user.accountNumber"), transaction.bankAccount],
                          [t("user.transferContent"), transaction.transferContent]
                        ].map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-stone-500">{label}</dt>
                            <dd className="mt-1 flex items-center gap-2 font-semibold">
                              <span>{value}</span>
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => copyValue(value)}
                                  aria-label={`${t("user.copy")} ${label}`}
                                  className="text-stone-400 hover:text-[#A98252]"
                                >
                                  <Copy size={15} />
                                </button>
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-6 rounded-2xl bg-[#F7F0E6] p-4 dark:bg-[#2B241F]">
                        <p className="text-sm text-stone-600 dark:text-stone-300">
                          {t("user.transferAmount")}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#8B6A43] dark:text-[#C5A26B]">
                          {formatVnd(transaction.transferAmountVnd)}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          {t("user.paymentAmountExact")}: {formatCurrency(transaction.amount)}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center gap-2 text-sm text-stone-500">
                        <Landmark size={16} />
                        <span>
                          {transaction.paidAt
                            ? `${t("user.paidAt")}: ${new Date(transaction.paidAt).toLocaleString(language === "vi" ? "vi-VN" : "en-US")}`
                            : t("user.paymentAutoUpdate")}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default TransactionHistory;
