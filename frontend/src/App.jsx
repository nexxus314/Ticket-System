import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login");

  function logout() {
    setToken(null);
    setRole(null);
    setPage("login");
  }

  if (!token) {
    return page === "login" ? (
      <Login setToken={setToken} setRole={setRole} setPage={setPage} />
    ) : (
      <Signup setPage={setPage} />
    );
  }

  if (role === "admin") {
    return <AdminDashboard token={token} logout={logout} />;
  }

  return <UserDashboard token={token} logout={logout} />;
}

export default App;