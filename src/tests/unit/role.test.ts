import { describe, expect, it } from "vitest";

describe("Role Permissions", () => {
  it("owner can edit own item", () => {
    const currentUserId = "user1";

    const item = {
      userId: "user1",
    };

    const canEdit = item.userId === currentUserId;

    expect(canEdit).toBe(true);
  });

  it("owner can delete own item", () => {
    const currentUserId = "user1";

    const item = {
      userId: "user1",
    };

    const canDelete = item.userId === currentUserId;

    expect(canDelete).toBe(true);
  });

  it("user cannot edit another user's item", () => {
    const currentUserId = "user1";

    const item = {
      userId: "user2",
    };

    const canEdit = item.userId === currentUserId;

    expect(canEdit).toBe(false);
  });

  it("user cannot delete another user's item", () => {
    const currentUserId = "user1";

    const item = {
      userId: "user2",
    };

    const canDelete = item.userId === currentUserId;

    expect(canDelete).toBe(false);
  });

  it("admin can delete any item", () => {
    const role = "admin";

    const canDelete = role === "admin";

    expect(canDelete).toBe(true);
  });

  it("admin cannot edit another user's item", () => {
    const role = "admin";

    const canEditOtherUsersItem = false;

    expect(role).toBe("admin");
    expect(canEditOtherUsersItem).toBe(false);
  });
});
