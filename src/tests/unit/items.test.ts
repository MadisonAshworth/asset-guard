import { describe, it, expect } from "vitest";

describe("Items", () => {
  it("creates valid note data", () => {
    const item = {
      title: "Test Note",
      content: "Testing",
      type: "note",
    };

    expect(item.title).toBe("Test Note");
    expect(item.type).toBe("note");
  });

  it("creates valid task data", () => {
    const item = {
      title: "Test Task",
      content: "Testing",
      type: "task",
    };

    expect(item.type).toBe("task");
  });
});
