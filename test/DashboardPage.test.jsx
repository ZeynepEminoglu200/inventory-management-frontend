import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "../src/pages/DashboardPage";
import api from "../src/services/api";

vi.mock("../src/services/api", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ to, children, className }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  };
});

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  it("renders the page title and navbar", async () => {
    api.get
      .mockResolvedValueOnce({ data: [{ id: 1, name: "Electronics" }] })
      .mockResolvedValueOnce({ data: [] });

    render(<DashboardPage />);

    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByText("Inventory Dashboard")).toBeInTheDocument();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("categories/");
      expect(api.get).toHaveBeenCalledWith("items/?");
    });
  });

  it("renders items and category names after loading", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: "Laptop",
            description: "Dell Latitude",
            quantity: 10,
            category: 1,
          },
        ],
      });

    render(<DashboardPage />);

    expect(await screen.findByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Dell Latitude")).toBeInTheDocument();
    expect(screen.getByText(/Quantity:/)).toBeInTheDocument();
    expect(screen.getByText(/Category:/)).toBeInTheDocument();

    const electronicsMatches = screen.getAllByText("Electronics");
    expect(electronicsMatches.length).toBeGreaterThan(0);
  });

  it("shows low stock badge for low stock items", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: "Mouse",
            description: "Wireless mouse",
            quantity: 2,
            category: 1,
          },
        ],
      });

    render(<DashboardPage />);

    expect(await screen.findByText("Low Stock")).toBeInTheDocument();
  });

  it("shows empty state when no items are returned", async () => {
    api.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    render(<DashboardPage />);

    expect(
      await screen.findByText(
        "No items found. Try changing your filters or add a new item."
      )
    ).toBeInTheDocument();
  });

  it("shows error message when fetching items fails", async () => {
    api.get
      .mockResolvedValueOnce({ data: [] })
      .mockRejectedValueOnce({
        response: { data: { detail: "Failed to load items." } },
      });

    render(<DashboardPage />);

    expect(
      await screen.findByText("Failed to load items.")
    ).toBeInTheDocument();
  });

  it("applies search and low stock filters when clicking Apply Filters", async () => {
    api.get
      .mockResolvedValueOnce({ data: [{ id: 1, name: "Electronics" }] })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    render(<DashboardPage />);

    await screen.findByText("Inventory Dashboard");

    fireEvent.change(screen.getByPlaceholderText("Search item name"), {
      target: { value: "laptop" },
    });

    fireEvent.click(screen.getByLabelText("Low stock only"));

    fireEvent.click(screen.getByRole("button", { name: "Apply Filters" }));

    await waitFor(() => {
      expect(api.get).toHaveBeenLastCalledWith(
        "items/?search=laptop&low_stock=true&"
      );
    });
  });

  it("filters by category when Apply Filters is clicked", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [
          { id: 1, name: "Electronics" },
          { id: 2, name: "Furniture" },
        ],
      })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    render(<DashboardPage />);

    await screen.findByText("Inventory Dashboard");

    fireEvent.change(screen.getByDisplayValue("All categories"), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Apply Filters" }));

    await waitFor(() => {
      expect(api.get).toHaveBeenLastCalledWith("items/?category=2&");
    });
  });

  it("clears filters and reloads all items", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: "Laptop",
            description: "Dell Latitude",
            quantity: 10,
            category: 1,
          },
        ],
      });

    render(<DashboardPage />);

    await screen.findByText("Inventory Dashboard");

    fireEvent.change(screen.getByPlaceholderText("Search item name"), {
      target: { value: "mouse" },
    });

    fireEvent.click(screen.getByLabelText("Low stock only"));
    fireEvent.click(screen.getByRole("button", { name: "Clear Filters" }));

    await waitFor(() => {
      expect(api.get).toHaveBeenLastCalledWith("items/");
    });

    expect(screen.getByPlaceholderText("Search item name")).toHaveValue("");
  });

  it("deletes an item after confirmation", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: "Laptop",
            description: "Dell Latitude",
            quantity: 10,
            category: 1,
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: "Laptop",
            description: "Dell Latitude",
            quantity: 10,
            category: 1,
          },
        ],
      });

    api.delete.mockResolvedValueOnce({});

    render(<DashboardPage />);

    expect(await screen.findByText("Laptop")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith("items/1/");
    });
  });

  it("does not delete an item if confirmation is cancelled", async () => {
    window.confirm.mockImplementationOnce(() => false);

    api.get
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Electronics" }],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: "Laptop",
            description: "Dell Latitude",
            quantity: 10,
            category: 1,
          },
        ],
      });

    render(<DashboardPage />);

    expect(await screen.findByText("Laptop")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(api.delete).not.toHaveBeenCalled();
  });
});