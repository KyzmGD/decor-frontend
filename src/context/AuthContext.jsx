import {
  createContext,
  useState,
  useEffect
} from "react";

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid saved user data:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

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
