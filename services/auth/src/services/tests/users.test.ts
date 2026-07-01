import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "../users";
import { findUserByEmail, createUser } from "../../repositories/users";

// Replace the real repository with fakes (hoisted to the top automatically).
vi.mock("../../repositories/users");

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

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset 
  });

  it("does not return the password_hash", async () => {

    vi.mocked(findUserByEmail).mockResolvedValue(null); 

    vi.mocked(createUser).mockResolvedValue({
      id: 1,
      email: "a@b.com",
      role: "user",
      created_at: "2026-01-01T00:00:00.000Z",
      password_hash: "some_hashed_value",
    } as any);

    // Function object
    const result = await registerUser({ email: "a@b.com", password: "secret" });

    // Expectations
    expect(result).not.toHaveProperty("password_hash");
    console.log(JSON.stringify(result));

    expect(result.email).toBe("a@b.com");
    expect(result.id).toBe(1);
  });

  it("Email is already registered", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
        id: 1,
        email: "a@b.com",
        role: "user",
        created_at: "2026-01-01T00:00:00.000Z",
        password_hash: "some_hashed_value",
    } as any);

    await expect(
    registerUser({ email: "a@b.com", password: "secret" })
    ).rejects.toThrow("Email is already registered");

  })
});