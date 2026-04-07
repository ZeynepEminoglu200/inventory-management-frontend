import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AddItemPage from "../src/pages/AddItemPage";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../src/services/api", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(),
  },
}));

vi.mock("../src/components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("../src/components/ItemForm", () => ({
  default: () => <div>Mock ItemForm</div>,
}));

describe("AddItemPage", () => {
  it("renders page title", () => {
    render(<AddItemPage />);
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("renders Navbar and ItemForm", () => {
    render(<AddItemPage />);
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByText("Mock ItemForm")).toBeInTheDocument();
  });
});