import {
  useCallback,
  createContext,
  useState
} from "react";

const AuthContext = createContext();

export default AuthContext;

const getInitialUser = () => {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");

  if (!savedUser || !savedToken) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid saved user data:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const loading = false;

  const loginUser = (userData, jwtToken) => {
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

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
