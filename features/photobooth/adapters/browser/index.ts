import {
  BrowserCameraAdapter,
  captureFrameFromVideo,
  recordClip,
} from "./BrowserCameraAdapter";
import { BrowserCaptureRepository } from "./BrowserCaptureRepository";
import { BrowserExperienceRepository } from "./BrowserExperienceRepository";
import { BrowserFrameRepository } from "./BrowserFrameRepository";
import { BrowserGeneratorRepository } from "./BrowserGeneratorRepository";
import { BrowserLayoutRepository } from "./BrowserLayoutRepository";

export const browserExperienceRepository = new BrowserExperienceRepository();
export const browserLayoutRepository = new BrowserLayoutRepository();
export const browserFrameRepository = new BrowserFrameRepository();
export const browserCaptureRepository = new BrowserCaptureRepository();
export const browserGeneratorRepository = new BrowserGeneratorRepository();
export const browserCameraAdapter = new BrowserCameraAdapter();

export {
  BrowserCameraAdapter,
  BrowserCaptureRepository,
  BrowserExperienceRepository,
  BrowserFrameRepository,
  BrowserGeneratorRepository,
  BrowserLayoutRepository,
  captureFrameFromVideo,
  recordClip,
};
