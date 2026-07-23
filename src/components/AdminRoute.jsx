import { Navigate }
  from "react-router-dom";
import { useContext } from "react";
import LanguageContext from "../context/LanguageContext";

function AdminRoute({
  user,
  loading,
  children
}) {
  const { t } = useContext(LanguageContext);

  if (loading) {
    return <p className="p-10">{t("common.loading")}</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
      />
    );
  }

  if (
    user.role !== "admin"
  ) {
    return (
      <Navigate
        to="/"
      />
    );
  }

  return children;
}

export default AdminRoute;
