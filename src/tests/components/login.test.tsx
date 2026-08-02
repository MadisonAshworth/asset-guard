import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: null,
        },
      }),
      signInWithPassword: vi.fn(),
    },
  },
}));

import LoginPage from "../../app/login/page";

afterEach(() => {
  cleanup();
});

describe("Login Page", () => {
  it("renders AssetGuard heading", () => {
    render(<LoginPage />);

    expect(screen.getByText("AssetGuard")).toBeDefined();
  });

  it("renders email input", () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText("Email")).toBeDefined();
  });

  it("renders password input", () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText("Password")).toBeDefined();
  });

  it("renders login button", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("button", {
        name: "Login",
      }),
    ).toBeDefined();
  });
});
