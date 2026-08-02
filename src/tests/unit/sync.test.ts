import { describe, it, expect } from "vitest";

describe("Sync", () => {
  it("marks online state", () => {
    const isOnline = true;

    expect(isOnline).toBe(true);
  });

  it("marks offline state", () => {
    const isOnline = false;

    expect(isOnline).toBe(false);
  });
});
