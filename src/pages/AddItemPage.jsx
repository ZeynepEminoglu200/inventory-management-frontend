import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ItemForm from "../components/ItemForm";

function AddItemPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("categories/");
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("items/", {
        ...formData,
        quantity: Number(formData.quantity),
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Add Item</h1>
      <ItemForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        categories={categories}
        submitLabel="Create Item"
        error={error}
        loading={loading}
      />
    </div>
  );
}

export default AddItemPage;