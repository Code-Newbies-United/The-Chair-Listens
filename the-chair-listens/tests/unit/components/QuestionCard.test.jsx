import { render, screen } from "@testing-library/react";
import QuestionCard from "@/components/QuestionCard";

describe("QuestionCard", () => {
  it("renders the category label when provided", () => {
    render(<QuestionCard category="For Men" question="How are you feeling?" />);
    expect(screen.getByText("For Men")).toBeInTheDocument();
  });

  it("renders the question text", () => {
    render(<QuestionCard category="For Men" question="How are you feeling?" />);
    expect(screen.getByRole("heading", { name: "How are you feeling?" })).toBeInTheDocument();
  });

  it("renders children inside the card", () => {
    render(
      <QuestionCard category="For Men" question="How are you feeling?">
        <button>Child button</button>
      </QuestionCard>
    );
    expect(screen.getByRole("button", { name: "Child button" })).toBeInTheDocument();
  });
});
