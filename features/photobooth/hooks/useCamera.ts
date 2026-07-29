"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { browserCameraAdapter } from "@/features/photobooth/adapters/browser";
import { useCameraStore } from "@/features/photobooth/stores";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const permission = useCameraStore((s) => s.permission);
  const facingMode = useCameraStore((s) => s.facingMode);
  const error = useCameraStore((s) => s.error);
  const setPermission = useCameraStore((s) => s.setPermission);
  const setStreaming = useCameraStore((s) => s.setStreaming);
  const setError = useCameraStore((s) => s.setError);

  const start = useCallback(async () => {
    setPermission("prompting");
    setError(null);
    try {
      const media = await browserCameraAdapter.requestStream(facingMode);
      setStream(media);
      setPermission("granted");
      setStreaming(true);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (err) {
      setPermission("denied");
      setStreaming(false);
      setError(err instanceof Error ? err.message : "Camera permission denied");
    }
  }, [facingMode, setError, setPermission, setStreaming]);

  const stop = useCallback(() => {
    browserCameraAdapter.stop();
    setStream(null);
    setStreaming(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [setStreaming]);

  useEffect(() => {
    return () => {
      browserCameraAdapter.stop();
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return {
    videoRef,
    stream,
    permission,
    error,
    start,
    stop,
  };
}
