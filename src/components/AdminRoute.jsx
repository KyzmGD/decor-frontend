import { Navigate }
  from "react-router-dom";

function AdminRoute({
  user,
  loading,
  children
}) {

  if (loading) {
    return <p>Loading...</p>;
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