import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">Inventory System</div>

        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-item">Add Item</Link>
          <Link to="/stock-history">Stock History</Link>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;