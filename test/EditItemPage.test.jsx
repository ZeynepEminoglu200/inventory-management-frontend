import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditItemPage from "../src/pages/EditItemPage";
import api from "../src/services/api";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

vi.mock("../src/services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("../src/components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("../src/components/ItemForm", () => ({
  default: ({
    formData,
    handleChange,
    handleSubmit,
    categories,
    submitLabel,
    error,
    loading,
  }) => (
    <form onSubmit={handleSubmit}>
      <div data-testid="categories-count">{categories.length}</div>
      <div data-testid="error-message">{error}</div>
      <div data-testid="loading-state">{loading ? "loading" : "idle"}</div>

      <input
        name="name"
        placeholder="Item name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
      />
      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />

      <button type="submit">{submitLabel}</button>
    </form>
  ),
}));

describe("EditItemPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title and navbar", async () => {
    api.get
      .mockResolvedValueOnce({
        data: {
          name: "Laptop",
          description: "Dell Latitude",
          quantity: 10,
          category: 1,
        },
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      });

    render(<EditItemPage />);

    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByText("Edit Item")).toBeInTheDocument();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("items/1/");
      expect(api.get).toHaveBeenCalledWith("categories/");
    });
  });

  it("loads item data and categories on mount", async () => {
    api.get
      .mockResolvedValueOnce({
        data: {
          name: "Laptop",
          description: "Dell Latitude",
          quantity: 10,
          category: 1,
        },
      })
      .mockResolvedValueOnce({
        data: [
          { id: 1, name: "Electronics" },
          { id: 2, name: "Furniture" },
        ],
      });

    render(<EditItemPage />);

    expect(await screen.findByDisplayValue("Laptop")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dell Latitude")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByTestId("categories-count")).toHaveTextContent("2");
  });

  it("shows an error if item details fail to load", async () => {
    api.get.mockRejectedValueOnce(new Error("Failed request"));

    render(<EditItemPage />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Failed to load item details."
      );
    });
  });

  it("updates form data when inputs change", async () => {
    api.get
      .mockResolvedValueOnce({
        data: {
          name: "Laptop",
          description: "Dell Latitude",
          quantity: 10,
          category: 1,
        },
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      });

    render(<EditItemPage />);

    const nameInput = await screen.findByPlaceholderText("Item name");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const categoryInput = screen.getByPlaceholderText("Category");

    fireEvent.change(nameInput, { target: { name: "name", value: "Monitor" } });
    fireEvent.change(descriptionInput, {
      target: { name: "description", value: "Office monitor" },
    });
    fireEvent.change(quantityInput, {
      target: { name: "quantity", value: "7" },
    });
    fireEvent.change(categoryInput, {
      target: { name: "category", value: "2" },
    });

    expect(nameInput.value).toBe("Monitor");
    expect(descriptionInput.value).toBe("Office monitor");
    expect(quantityInput.value).toBe("7");
    expect(categoryInput.value).toBe("2");
  });

  it("submits updated item data and navigates to dashboard on success", async () => {
    api.get
      .mockResolvedValueOnce({
        data: {
          name: "Laptop",
          description: "Dell Latitude",
          quantity: 10,
          category: 1,
        },
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      });

    api.put.mockResolvedValueOnce({ data: { id: 1 } });

    render(<EditItemPage />);

    const nameInput = await screen.findByPlaceholderText("Item name");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const categoryInput = screen.getByPlaceholderText("Category");

    fireEvent.change(nameInput, { target: { name: "name", value: "Laptop Pro" } });
    fireEvent.change(descriptionInput, {
      target: { name: "description", value: "Updated Dell Latitude" },
    });
    fireEvent.change(quantityInput, {
      target: { name: "quantity", value: "8" },
    });
    fireEvent.change(categoryInput, {
      target: { name: "category", value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Update Item" }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("items/1/", {
        name: "Laptop Pro",
        description: "Updated Dell Latitude",
        quantity: 8,
        category: 1,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error if updating the item fails", async () => {
    api.get
      .mockResolvedValueOnce({
        data: {
          name: "Laptop",
          description: "Dell Latitude",
          quantity: 10,
          category: 1,
        },
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      });

    api.put.mockRejectedValueOnce(new Error("Update failed"));

    render(<EditItemPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Update Item" }));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Failed to update item."
      );
    });
  });

  it("sets loading state during submission", async () => {
    api.get
      .mockResolvedValueOnce({
        data: {
          name: "Laptop",
          description: "Dell Latitude",
          quantity: 10,
          category: 1,
        },
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      });

    let resolvePut;
    api.put.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePut = resolve;
      })
    );

    render(<EditItemPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Update Item" }));

    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");
    });

    resolvePut({ data: { id: 1 } });

    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent("idle");
    });
  });
});