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
    useState(null);

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      )
    );

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "user"
      );

    if (savedUser) {

      setUser(
        JSON.parse(savedUser)
      );

    }

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
        loginUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}