import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";

describe("resizable panels", () => {
  it.each([
    ["horizontal", "vertical", "row"],
    ["vertical", "horizontal", "column"],
  ] as const)("renders a %s group with a matching separator", (group, separator, direction) => {
    const markup = renderToStaticMarkup(
      <ResizablePanelGroup orientation={group}>
        <ResizablePanel />
        <ResizableHandle withHandle />
        <ResizablePanel />
      </ResizablePanelGroup>,
    );

    expect(markup).toContain(`flex-direction:${direction}`);
    expect(markup).toContain(`aria-orientation="${separator}"`);
    expect(markup).toContain("aria-[orientation=horizontal]:w-full");
    expect(markup).not.toContain("data-[panel-group-direction");
  });
});
