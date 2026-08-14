import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("macOS portfolio desktop", () => {
  test("opens dock apps and desktop overlays", () => {
    render(<App />);

    expect(screen.getAllByText("Inzamamul Haque").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(screen.getByRole("heading", { name: "Web & Product Projects" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Spotlight search" }));
    expect(screen.getByRole("textbox", { name: "Spotlight search" })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("textbox", { name: "Spotlight search" }), { key: "Escape" });
    expect(screen.queryByRole("textbox", { name: "Spotlight search" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mission Control" }));
    expect(screen.getByRole("heading", { name: "Mission Control" })).toBeInTheDocument();
  });
});
