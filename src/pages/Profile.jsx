import {
  useContext
} from "react";

import AuthContext
  from "../context/AuthContext";

function Profile() {

  const {
    user
  } = useContext(
    AuthContext
  );

  return (
    <div
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
        Profile
      </h1>

      <p>
        Name:
        {" "}
        {user?.fullname}
      </p>

      <p>
        Email:
        {" "}
        {user?.email}
      </p>

      <p>
        Role:
        {" "}
        {user?.role}
      </p>

    </div>
  );
}

export default Profile;