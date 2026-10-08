import { validateAll, validateField } from "./validateContact.js";

describe("validateField", () => {
  it.each(["name", "email", "message"])("requires %s", (field) => {
    expect(validateField(field, "")).not.toBe("");
  });

  it("treats a value of only spaces as empty", () => {
    expect(validateField("name", "   ")).toBe("Please enter your name.");
    expect(validateField("message", " \n ")).toBe("Please write a message.");
  });

  it("accepts normal values", () => {
    expect(validateField("name", "Ada Lovelace")).toBe("");
    expect(validateField("message", "Hello!")).toBe("");
  });

  it.each(["ada", "ada@", "ada@example", "@example.com", "ada @example.com"])(
    "rejects the email %j",
    (email) => {
      expect(validateField("email", email)).toMatch(/valid email/i);
    },
  );

  it.each(["ada@example.com", "ada.lovelace+work@mail.example.co.uk"])(
    "accepts the email %j",
    (email) => {
      expect(validateField("email", email)).toBe("");
    },
  );

  it("asks for an email before saying the email is invalid", () => {
    expect(validateField("email", "")).toMatch(/enter your email/i);
  });
});

describe("validateAll", () => {
  it("returns a message for every empty field, in form order", () => {
    const errors = validateAll({ name: "", email: "", message: "" });

    expect(Object.keys(errors)).toEqual(["name", "email", "message"]);
    expect(Object.values(errors).every(Boolean)).toBe(true);
  });

  it("returns only empty messages when everything is fine", () => {
    expect(
      validateAll({ name: "Ada", email: "ada@example.com", message: "Hi" }),
    ).toEqual({ name: "", email: "", message: "" });
  });
});
