import { render, screen } from "@testing-library/react";
import FormField from "./FormField.jsx";

describe("FormField", () => {
  it("connects the label to the input", () => {
    render(<FormField label="Name" name="name" value="" onChange={() => {}} />);

    const input = screen.getByLabelText("Name");
    expect(input.tagName).toBe("INPUT");
    expect(input).toBeRequired();
  });

  it("can be a textarea", () => {
    render(
      <FormField
        label="Message"
        name="message"
        value=""
        multiline
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
  });

  it("uses the given input type", () => {
    render(
      <FormField
        label="Email"
        name="email"
        type="email"
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("is valid and has no message when there is no error", () => {
    render(
      <FormField label="Name" name="name" value="Ada" onChange={() => {}} />,
    );

    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("shows the error and ties it to the input", () => {
    render(
      <FormField
        label="Name"
        name="name"
        value=""
        error="Please enter your name."
        onChange={() => {}}
      />,
    );

    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Please enter your name.");
  });
});
