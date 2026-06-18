import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Toast from "@/components/fulbrightmap/Toast";

describe("Fulbright map Toast", () => {
  it("renders warning toasts without throwing", () => {
    render(
      <Toast
        toast={{
          id: 1,
          tone: "warning",
          title: "Live updates paused",
          detail: "The map will keep refreshing in the background.",
        }}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Live updates paused");
    expect(
      screen.getByText("The map will keep refreshing in the background."),
    ).toBeInTheDocument();
  });
});
