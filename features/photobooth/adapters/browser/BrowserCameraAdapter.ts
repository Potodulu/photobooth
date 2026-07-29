export class BrowserCameraAdapter {
  private stream: MediaStream | null = null;

  async requestStream(
    facingMode: "user" | "environment" = "user",
  ): Promise<MediaStream> {
    this.stop();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    this.stream = stream;
    return stream;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  stop(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }
}

export function captureFrameFromVideo(
  video: HTMLVideoElement,
  mimeType = "image/jpeg",
  quality = 0.92,
): Promise<{ blob: Blob; width: number; height: number }> {
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) {
    return Promise.reject(new Error("Video not ready"));
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("Canvas unsupported"));
  }

  ctx.drawImage(video, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to capture frame"));
          return;
        }
        resolve({ blob, width, height });
      },
      mimeType,
      quality,
    );
  });
}

function pickRecorderMime(): string | undefined {
  const candidates = [
    "video/mp4;codecs=avc1",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  if (typeof MediaRecorder === "undefined") return undefined;
  return candidates.find((mime) => MediaRecorder.isTypeSupported(mime));
}

/** Start/stop recorder so capture can run during countdown. */
export class ClipRecorder {
  private recorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private mimeType: string | undefined;
  private startedAt = 0;

  start(stream: MediaStream): void {
    this.chunks = [];
    this.mimeType = pickRecorderMime();
    this.recorder = this.mimeType
      ? new MediaRecorder(stream, { mimeType: this.mimeType })
      : new MediaRecorder(stream);
    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };
    this.startedAt = Date.now();
    this.recorder.start(250);
  }

  stop(): Promise<{ blob: Blob; mimeType: string; durationMs: number }> {
    const recorder = this.recorder;
    if (!recorder || recorder.state === "inactive") {
      return Promise.resolve({
        blob: new Blob([], { type: this.mimeType || "video/webm" }),
        mimeType: this.mimeType || "video/webm",
        durationMs: 0,
      });
    }

    return new Promise((resolve, reject) => {
      recorder.onerror = () => reject(new Error("Recording failed"));
      recorder.onstop = () => {
        const type = recorder.mimeType || this.mimeType || "video/webm";
        resolve({
          blob: new Blob(this.chunks, { type }),
          mimeType: type,
          durationMs: Date.now() - this.startedAt,
        });
        this.recorder = null;
      };
      recorder.stop();
    });
  }
}

export function recordClip(
  stream: MediaStream,
  durationMs: number,
): Promise<{ blob: Blob; mimeType: string; durationMs: number }> {
  const recorder = new ClipRecorder();
  recorder.start(stream);
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      recorder.stop().then(resolve).catch(reject);
    }, durationMs);
  });
}
