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

    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(screen.getByRole("heading", { name: "SignalDesk AI" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Spotlight search" }));
    expect(screen.getByRole("textbox", { name: "Spotlight search" })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("textbox", { name: "Spotlight search" }), { key: "Escape" });
    expect(screen.queryByRole("textbox", { name: "Spotlight search" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mission Control" }));
    expect(screen.getByRole("heading", { name: "Mission Control" })).toBeInTheDocument();
  });
});
