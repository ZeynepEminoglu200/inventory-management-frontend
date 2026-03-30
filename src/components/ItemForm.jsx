function ItemForm({ formData, handleChange, handleSubmit, categories, submitLabel, error, loading }) {
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Item name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
      />

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default ItemForm;