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
