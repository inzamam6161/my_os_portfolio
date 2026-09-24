import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("macOS portfolio desktop", () => {
  test("shows featured work and opens project case studies and overlays", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Inzamamul Haque" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured Projects" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open LifeOS case study" }));
    expect(screen.getByText("Mobile engineering case study")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Portfolio navigation" }));
    expect(screen.queryByText("Mobile engineering case study")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Projects navigation" }));
    expect(screen.getByRole("heading", { name: "SignalDesk" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Spotlight search" }));
    expect(screen.getByRole("textbox", { name: "Spotlight search" })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("textbox", { name: "Spotlight search" }), { key: "Escape" });
    expect(screen.queryByRole("textbox", { name: "Spotlight search" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mission Control" }));
    expect(screen.getByRole("heading", { name: "Mission Control" })).toBeInTheDocument();
  });

  test("expands and closes the recruiter assistant as a modal dialog", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Expand Ask About Me" }));

    const dialog = screen.getByRole("dialog", { name: "Ask About Me" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Ask About Me" })).not.toBeInTheDocument();
  });

  test("expands projects and skills into readable modal views", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Expand Featured Projects" }));
    expect(screen.getByRole("dialog", { name: "Featured Projects" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close expanded projects" }));
    expect(screen.queryByRole("dialog", { name: "Featured Projects" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Expand Skills and Tools" }));
    expect(screen.getByRole("dialog", { name: "Skills & Tools" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close expanded skills" }));
    expect(screen.queryByRole("dialog", { name: "Skills & Tools" })).not.toBeInTheDocument();
  });
});
