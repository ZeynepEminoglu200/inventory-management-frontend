import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ItemForm from "../components/ItemForm";

function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemResponse, categoryResponse] = await Promise.all([
          api.get(`items/${id}/`),
          api.get("categories/"),
        ]);

        setFormData({
          name: itemResponse.data.name || "",
          description: itemResponse.data.description || "",
          quantity: itemResponse.data.quantity || 0,
          category: itemResponse.data.category || "",
        });

        setCategories(categoryResponse.data);
      } catch (err) {
        setError("Failed to load item details.");
      }
    };

    fetchData();
  }, [id]);

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
      await api.put(`items/${id}/`, {
        ...formData,
        quantity: Number(formData.quantity),
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Edit Item</h1>
      <ItemForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        categories={categories}
        submitLabel="Update Item"
        error={error}
        loading={loading}
      />
    </div>
  );
}

export default EditItemPage;