import { describe, it, expect } from "vitest";
import { registerUser } from "../users";

describe("registerUser validation", () => {
  it("rejects when email is missing", async () => {
    await expect(
      registerUser({ email: "", password: "secret" })
    ).rejects.toThrow("Email is required");
  });

  it("rejects when password is missing", async () => {
    await expect(
        registerUser({ email: "test@gmail.com", password: "" })
        ).rejects.toThrow("Password is required");
  })

});