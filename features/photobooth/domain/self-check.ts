import assert from "node:assert/strict";
import {
  createId,
  MAX_CAPTURE_TAKES,
  PHOTOBOOTH_MANIFEST_VERSION,
} from "../domain";
import layouts from "../metadata/layouts.json";
import frames from "../metadata/frames.json";
import experiences from "../metadata/experiences.json";

assert.equal(layouts.length, 3);
assert.ok(layouts.every((layout) => layout.slots.length >= 1));
assert.equal(layouts.find((l) => l.id === "single-1")?.slots.length, 1);
assert.equal(layouts.find((l) => l.id === "strip-2")?.slots.length, 2);
assert.equal(layouts.find((l) => l.id === "grid-4")?.slots.length, 4);

assert.equal(frames.length, 3);
assert.ok(frames.every((frame) => frame.supportedLayoutIds.length > 0));

assert.equal(experiences.length, 1);
assert.equal(experiences[0]?.slug, "online-guest-demo");
assert.equal(MAX_CAPTURE_TAKES, 10);
assert.equal(PHOTOBOOTH_MANIFEST_VERSION, "1.1.0");

const id = createId();
assert.ok(id.length > 8);

console.log("photobooth domain self-check ok");
