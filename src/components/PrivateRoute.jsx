import {
  Navigate
} from "react-router-dom";

function PrivateRoute({
  user,
  loading,
  children
}) {

  if (loading) {
    return <div>Loading...</div>;
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