import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import StockHistoryPage from "../src/pages/StockHistoryPage";
import api from "../src/services/api";

// Mock Navbar
vi.mock("../src/components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

// Mock API
vi.mock("../src/services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("StockHistoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title and navbar", async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    render(<StockHistoryPage />);

    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Stock History" })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("stock-logs/");
    });
  });

  it("displays stock logs when data is fetched successfully", async () => {
    api.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          item_name: "Laptop",
          change_amount: -3,
          user_name: "zeynep",
          timestamp: "2025-01-01",
        },
      ],
    });

    render(<StockHistoryPage />);

    expect(await screen.findByText(/Laptop/)).toBeInTheDocument();
    expect(screen.getByText(/Change: -3/)).toBeInTheDocument();
    expect(screen.getByText(/User: zeynep/)).toBeInTheDocument();
    expect(screen.getByText(/Time: 2025-01-01/)).toBeInTheDocument();
  });

  it("shows multiple stock logs", async () => {
    api.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          item_name: "Laptop",
          change_amount: -3,
          user_name: "zeynep",
          timestamp: "2025-01-01",
        },
        {
          id: 2,
          item_name: "Mouse",
          change_amount: 5,
          user_name: "zeynep",
          timestamp: "2025-01-02",
        },
      ],
    });

    render(<StockHistoryPage />);

    expect(await screen.findByText(/Laptop/)).toBeInTheDocument();
    expect(screen.getByText(/Mouse/)).toBeInTheDocument();
  });

  it("shows error message when API call fails", async () => {
    api.get.mockRejectedValueOnce(new Error("API error"));

    render(<StockHistoryPage />);

    expect(
      await screen.findByText("Failed to load stock history.")
    ).toBeInTheDocument();
  });

  it("renders empty list when no logs exist", async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    render(<StockHistoryPage />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    // No logs should be displayed
    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.length).toBe(0);
  });
});