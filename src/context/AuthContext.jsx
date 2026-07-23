import {
  createContext,
  useState,
  useEffect
} from "react";

const AuthContext =
  createContext();

export default AuthContext;

export function AuthProvider({
  children
}) {

  const [user, setUser] =
  useState(undefined);

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      )
    );
  const [loading, setLoading] =
  useState(true);

  useEffect(() => {

  const savedUser =
    localStorage.getItem(
      "user"
    );

  if (savedUser) {

    setUser(
      JSON.parse(savedUser)
    );

  } else {

    setUser(null);

  }

  setLoading(false);

}, []);

  const loginUser = (
    userData,
    jwtToken
  ) => {

    setUser(userData);

    setToken(jwtToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      jwtToken
    );
  };

  const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );
  };

  return (
    <AuthContext.Provider
      value={{
  user,
  token,
  loading,
  loginUser,
  logout
}}
    >
      {children}
    </AuthContext.Provider>
  );
}