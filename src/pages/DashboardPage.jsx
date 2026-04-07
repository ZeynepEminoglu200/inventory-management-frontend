import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function DashboardPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      let url = "items/?";

      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      if (lowStockOnly) url += "low_stock=true&";

      const response = await api.get(url);
      setItems(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await api.delete(`items/${id}/`);
      fetchItems();
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete item.");
    }
  };

  const handleClearFilters = async () => {
    setSearch("");
    setSelectedCategory("");
    setLowStockOnly(false);

    try {
      setLoading(true);
      const response = await api.get("items/");
      setItems(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorised";
  };

  const lowStockCount = items.filter((item) => item.quantity < 5).length;

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Inventory Dashboard</h1>
            <p className="muted">
              Manage your stock, categories, and low inventory items.
            </p>
          </div>

          <Link to="/add-item" className="btn-primary">
            Add New Item
          </Link>
        </div>

        <section className="card filters-card">
          <h2>Filters</h2>

          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search item name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
              />
              Low stock only
            </label>

            <button className="btn-primary" onClick={fetchItems}>
              Apply Filters
            </button>

            <button className="btn-secondary" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </section>

        <section className="card spacer-bottom">
          <h2>Overview</h2>
          <p className="muted">
            Total items: <strong>{items.length}</strong> | Categories:{" "}
            <strong>{categories.length}</strong> | Low stock items:{" "}
            <strong>{lowStockCount}</strong>
          </p>
        </section>

        {loading && <p className="status-message">Loading items...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && items.length === 0 && (
          <div className="empty-state">
            No items found. Try changing your filters or add a new item.
          </div>
        )}

        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-card-header">
                <h3>{item.name}</h3>
                {item.quantity < 5 && (
                  <span className="low-stock-badge">Low Stock</span>
                )}
              </div>

              <p className="item-description">
                {item.description || "No description provided."}
              </p>

              <div className="item-meta">
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Category:</strong> {getCategoryName(item.category)}
                </p>
              </div>

              <div className="item-actions">
                <Link to={`/edit-item/${item.id}`} className="btn-secondary">
                  Edit
                </Link>

                <button
                  className="btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;