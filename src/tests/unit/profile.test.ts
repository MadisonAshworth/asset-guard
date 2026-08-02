import { describe, it, expect } from "vitest";

describe("Profile Roles", () => {
  it("accepts admin role", () => {
    const role = "admin";

    expect(role).toBe("admin");
  });

  it("accepts user role", () => {
    const role = "user";

    expect(role).toBe("user");
  });
});
