import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../src/pages/RegisterPage";
import api from "../src/services/api";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

vi.mock("../src/services/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the register form", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: "Register" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Create an account to manage your inventory securely.")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("updates input values when the user types", () => {
    render(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, {
      target: { name: "username", value: "zeynep" },
    });
    fireEvent.change(emailInput, {
      target: { name: "email", value: "zey@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { name: "password", value: "Test1234!" },
    });

    expect(usernameInput).toHaveValue("zeynep");
    expect(emailInput).toHaveValue("zey@example.com");
    expect(passwordInput).toHaveValue("Test1234!");
  });

  it("submits registration data and navigates to login on success", async () => {
    api.post.mockResolvedValueOnce({ data: { id: 1 } });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { name: "username", value: "zeynep" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { name: "email", value: "zey@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { name: "password", value: "Test1234!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("register/", {
        username: "zeynep",
        email: "zey@example.com",
        password: "Test1234!",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});