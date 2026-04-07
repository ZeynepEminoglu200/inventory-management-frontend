import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../src/pages/LoginPage";
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

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

 it("renders the login form", () => {
  render(<LoginPage />);

  expect(
    screen.getByRole("heading", { name: "Login" })
  ).toBeInTheDocument();

  expect(
    screen.getByText("Sign in to access your inventory dashboard.")
  ).toBeInTheDocument();

  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  expect(screen.getByText("Register")).toBeInTheDocument();
}); 

  it("updates input values when the user types", () => {
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, {
      target: { name: "username", value: "zeynep" },
    });
    fireEvent.change(passwordInput, {
      target: { name: "password", value: "Test1234!" },
    });

    expect(usernameInput).toHaveValue("zeynep");
    expect(passwordInput).toHaveValue("Test1234!");
  });

  it("submits credentials, stores tokens, and navigates on success", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        access: "mock-access-token",
        refresh: "mock-refresh-token",
      },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { name: "username", value: "zeynep" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { name: "password", value: "Test1234!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("token/", {
        username: "zeynep",
        password: "Test1234!",
      });
    });

    expect(localStorage.getItem("access_token")).toBe("mock-access-token");
    expect(localStorage.getItem("refresh_token")).toBe("mock-refresh-token");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error message when login fails", async () => {
    api.post.mockRejectedValueOnce(new Error("Login failed"));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { name: "username", value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { name: "password", value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please check your username and password.")
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    let resolveRequest;
    api.post.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { name: "username", value: "zeynep" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { name: "password", value: "Test1234!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled();

    resolveRequest({
      data: {
        access: "mock-access-token",
        refresh: "mock-refresh-token",
      },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });
  });

  it("clears any previous error before a new submission", async () => {
    api.post.mockRejectedValueOnce(new Error("First failure"));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { name: "username", value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { name: "password", value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please check your username and password.")
      ).toBeInTheDocument();
    });

    api.post.mockResolvedValueOnce({
      data: {
        access: "new-access-token",
        refresh: "new-refresh-token",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});