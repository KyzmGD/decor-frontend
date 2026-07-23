import {
  useContext
} from "react";

import AuthContext
  from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Profile() {
  const { t } = useContext(LanguageContext);

  const {
    user
  } = useContext(
    AuthContext
  );

  return (
    <MainLayout><div
      className="
        max-w-4xl
        mx-auto
        py-10
      "
    >
      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        {t("common.profile")}
      </h1>

      <p>
        {t("common.name")}:
        {" "}
        {user?.fullname}
      </p>

      <p>
        {t("common.email")}:
        {" "}
        {user?.email}
      </p>

      <p>
        {t("common.role")}:
        {" "}
        {user?.role}
      </p>

    </div></MainLayout>
  );
}

export default Profile;
