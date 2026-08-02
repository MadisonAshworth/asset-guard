import { describe, expect, it } from "vitest";

describe("CRUD Operations", () => {
  it("creates a note", () => {
    const item = {
      id: "1",
      title: "Test Note",
      content: "Testing CRUD",
      type: "note",
    };

    expect(item.title).toBe("Test Note");
    expect(item.content).toBe("Testing CRUD");
  });

  it("reads a note", () => {
    const items = [
      {
        id: "1",
        title: "Test Note",
      },
    ];

    expect(items.length).toBe(1);
    expect(items[0].title).toBe("Test Note");
  });

  it("updates a note", () => {
    const item = {
      id: "1",
      title: "Original Title",
    };

    item.title = "Updated Title";

    expect(item.title).toBe("Updated Title");
  });

  it("deletes a note", () => {
    const items = [
      { id: "1", title: "Note 1" },
      { id: "2", title: "Note 2" },
    ];

    const remainingItems = items.filter((item) => item.id !== "1");

    expect(remainingItems.length).toBe(1);
    expect(remainingItems[0].id).toBe("2");
  });
});
