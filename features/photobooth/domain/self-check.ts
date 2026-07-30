import assert from "node:assert/strict";
import {
  createId,
  MAX_CAPTURE_TAKES,
  PHOTOBOOTH_MANIFEST_VERSION,
  PRINT_DPI,
  inToPx,
  paperSizeToPixels,
} from "../domain";
import layouts from "../metadata/layouts.json";
import frames from "../metadata/frames.json";
import experiences from "../metadata/experiences.json";

assert.equal(layouts.length, 5);
assert.ok(layouts.every((layout) => layout.slots.length >= 1));
assert.equal(layouts.find((l) => l.id === "single-1")?.slots.length, 1);
assert.equal(layouts.find((l) => l.id === "strip-2")?.slots.length, 2);
assert.equal(layouts.find((l) => l.id === "grid-4")?.slots.length, 4);
assert.equal(layouts.find((l) => l.id === "strip-2r")?.slots.length, 2);
assert.equal(layouts.find((l) => l.id === "strip-4r")?.slots.length, 2);

assert.equal(layouts.find((l) => l.id === "single-1")?.type, "digital");
assert.equal(layouts.find((l) => l.id === "strip-2")?.type, "digital");
assert.equal(layouts.find((l) => l.id === "grid-4")?.type, "digital");

const strip2r = layouts.find((l) => l.id === "strip-2r");
assert.equal(strip2r?.type, "paper");
assert.deepEqual(strip2r?.paperSize, { widthIn: 2.5, heightIn: 7 });
assert.equal(strip2r?.dpi, 300);
assert.deepEqual(
  strip2r?.outputSize,
  paperSizeToPixels({ widthIn: 2.5, heightIn: 7 }, 300),
);

const strip4r = layouts.find((l) => l.id === "strip-4r");
assert.equal(strip4r?.type, "paper");
assert.deepEqual(strip4r?.paperSize, { widthIn: 4, heightIn: 6 });
assert.deepEqual(
  strip4r?.outputSize,
  paperSizeToPixels({ widthIn: 4, heightIn: 6 }, 300),
);

assert.equal(inToPx(1, PRINT_DPI), 300);
assert.equal(PRINT_DPI, 300);

assert.ok(layouts.every((layout) => !layout.preview.startsWith("/")));

assert.equal(frames.length, 3);
assert.ok(frames.every((frame) => frame.supportedLayoutIds.length > 0));
assert.ok(frames.every((frame) => frame.overlay?.endsWith(".png")));
assert.ok(frames.every((frame) => frame.overlay?.startsWith("frames/")));
assert.ok(
  frames.every((frame) =>
    ["strip-2r", "strip-4r"].every((id) =>
      frame.supportedLayoutIds.includes(id),
    ),
  ),
);

assert.equal(experiences.length, 1);
assert.equal(experiences[0]?.slug, "online-guest-demo");
assert.equal(MAX_CAPTURE_TAKES, 10);
assert.equal(PHOTOBOOTH_MANIFEST_VERSION, "1.1.0");

const id = createId();
assert.ok(id.length > 8);

console.log("photobooth domain self-check ok");
