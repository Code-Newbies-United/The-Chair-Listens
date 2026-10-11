import { render, screen, fireEvent } from "@testing-library/react";
import TextResponse from "@/components/TextResponse";

describe("TextResponse", () => {
  it("renders the current value in the textarea", () => {
    render(<TextResponse value="hello" onChange={() => {}} placeholder="Type here" />);
    expect(screen.getByLabelText("Your answer")).toHaveValue("hello");
  });

  it("calls onChange with the new value when typed into", () => {
    const handleChange = jest.fn();
    render(<TextResponse value="" onChange={handleChange} placeholder="Type here" />);

    fireEvent.change(screen.getByLabelText("Your answer"), {
      target: { value: "new text" },
    });

    expect(handleChange).toHaveBeenCalledWith("new text");
  });

  it("does not render the mic button when speech is unsupported", () => {
    render(<TextResponse value="" onChange={() => {}} isSpeechSupported={false} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the mic button when speech is supported", () => {
    render(<TextResponse value="" onChange={() => {}} isSpeechSupported={true} />);
    expect(screen.getByRole("button", { name: "Speak your answer" })).toBeInTheDocument();
  });

  it("reflects isListening state via aria-pressed and label", () => {
    const { rerender } = render(
      <TextResponse value="" onChange={() => {}} isSpeechSupported={true} isListening={false} />
    );
    let button = screen.getByRole("button", { name: "Speak your answer" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent("Speak Answer");

    rerender(
      <TextResponse value="" onChange={() => {}} isSpeechSupported={true} isListening={true} />
    );
    button = screen.getByRole("button", { name: "Stop recording" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("Stop Recording...");
  });

  it("calls onToggleListening when the mic button is clicked", () => {
    const handleToggle = jest.fn();
    render(
      <TextResponse
        value=""
        onChange={() => {}}
        isSpeechSupported={true}
        onToggleListening={handleToggle}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Speak your answer" }));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("disables the textarea when disabled is true", () => {
    render(<TextResponse value="" onChange={() => {}} disabled={true} />);
    expect(screen.getByLabelText("Your answer")).toBeDisabled();
  });

  it("disables the mic button when disabled is true", () => {
    render(<TextResponse value="" onChange={() => {}} isSpeechSupported={true} disabled={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
