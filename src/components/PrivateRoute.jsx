import {
  Navigate
} from "react-router-dom";
import { useContext } from "react";
import LanguageContext from "../context/LanguageContext";

function PrivateRoute({
  user,
  loading,
  children
}) {
  const { t } = useContext(LanguageContext);

  if (loading) {
    return <div className="p-10">{t("common.loading")}</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
      />
    );
  }

  return children;
}

export default PrivateRoute;
