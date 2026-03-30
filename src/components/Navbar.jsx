import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/add-item">Add Item</Link> |{" "}
      <Link to="/stock-history">Stock History</Link> |{" "}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;