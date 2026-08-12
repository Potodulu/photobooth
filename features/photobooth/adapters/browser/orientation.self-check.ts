import assert from "node:assert/strict";
import { resolveDeviceOrientation } from "./orientation";

assert.deepEqual(
  resolveDeviceOrientation({
    type: "portrait-primary",
    angle: 0,
    viewportWidth: 390,
    viewportHeight: 844,
  }),
  { orientation: "portrait", angle: 0 },
);

assert.equal(
  resolveDeviceOrientation({
    type: "landscape-primary",
    angle: 90,
    viewportWidth: 844,
    viewportHeight: 390,
  }).orientation,
  "landscape-left",
);

assert.equal(
  resolveDeviceOrientation({
    type: "landscape-secondary",
    angle: 270,
    viewportWidth: 844,
    viewportHeight: 390,
  }).orientation,
  "landscape-right",
);

assert.equal(
  resolveDeviceOrientation({
    type: null,
    angle: null,
    viewportWidth: 390,
    viewportHeight: 844,
  }).orientation,
  "portrait",
);

assert.equal(
  resolveDeviceOrientation({
    type: null,
    angle: null,
    viewportWidth: 844,
    viewportHeight: 390,
  }).orientation,
  "landscape-left",
);

console.log("orientation self-check ok");
