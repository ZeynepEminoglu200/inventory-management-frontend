import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ProfilePage() {
  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    profile_image: null,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("profile/");
        setFormData({
          display_name: response.data.display_name || "",
          email: response.data.email || "",
          profile_image: null,
        });
        setCurrentImage(response.data.profile_image || "");
        setError("");
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
      setFormData((prev) => ({
        ...prev,
        profile_image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("display_name", formData.display_name);
      data.append("email", formData.email);

      if (formData.profile_image) {
        data.append("profile_image", formData.profile_image);
      }

      const response = await api.put("profile/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully.");
      setCurrentImage(response.data.profile_image || "");
      setFormData((prev) => ({
        ...prev,
        profile_image: null,
      }));
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <p className="status-message">Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container form-page-wrapper">
        <div className="form-card">
          <h1>My Profile</h1>
          <p className="form-subtitle">
            Update your profile details and profile picture.
          </p>

          {currentImage && (
            <div className="spacer-bottom">
              <img
                src={currentImage}
                alt="Profile"
                className="profile-image-preview"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-stack">
            <div className="form-group">
              <label htmlFor="display_name">Display Name</label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="Enter display name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile_image">Profile Picture</label>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Update Profile"}
              </button>
            </div>

            {error && <p className="status-message error">{error}</p>}
            {success && <p className="status-message success">{success}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;