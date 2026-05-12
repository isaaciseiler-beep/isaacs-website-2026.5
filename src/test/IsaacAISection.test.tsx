import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import IsaacAISection from "@/components/IsaacAISection";

describe("IsaacAISection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the chat frame fixed and caps a conversation at five user messages", async () => {
    let replies = 0;
    const fetchMock = vi.fn(async () => {
      replies += 1;
      return new Response(
        JSON.stringify({
          message: `Mock answer ${replies}`,
          sources: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    });

    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(<IsaacAISection />);
    const input = screen.getByLabelText("Message 1 of 5");
    const submit = screen.getByLabelText("Ask Isaac AI");
    const frame = container.querySelector(".h-\\[340px\\]");

    expect(frame).toBeTruthy();

    for (let index = 1; index <= 5; index += 1) {
      fireEvent.change(input, { target: { value: `Question ${index}` } });
      fireEvent.click(submit);
      await screen.findByText(`Mock answer ${index}`);
    }

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(5));
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(frame).toHaveClass("h-[340px]", "md:h-[400px]");
  });
});
