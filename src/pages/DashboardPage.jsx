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
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`items/${id}/`);
      fetchItems();
    } catch (err) {
      setError("Failed to delete item.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Inventory Dashboard</h1>

      <div>
        <input
          type="text"
          placeholder="Search item name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Low stock only
        </label>

        <button onClick={fetchItems}>Apply Filters</button>
      </div>

      {loading && <p>Loading items...</p>}
      {error && <p>{error}</p>}

      {!loading && items.length === 0 && <p>No items found.</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.description} - Qty: {item.quantity}
            {item.quantity < 5 && <span> ⚠ Low Stock</span>}
            {" | "}
            <Link to={`/edit-item/${item.id}`}>Edit</Link>
            {" | "}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;