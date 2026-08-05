"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { FrameAssetKind } from "@/constants/apiRoute";
import { frameService } from "@/services/frame";
import type { ListParams } from "@/libs/api";
import type { CreateFramePayload, FrameDto, UpdateFramePayload } from "@/types";

export const frameKeys = {
  all: ["frames"] as const,
  lists: () => [...frameKeys.all, "list"] as const,
  list: (params?: ListParams) => [...frameKeys.lists(), params] as const,
  details: () => [...frameKeys.all, "detail"] as const,
  detail: (id: string) => [...frameKeys.details(), id] as const,
};

export function useFrames(params?: ListParams) {
  return useQuery({
    queryKey: frameKeys.list(params),
    queryFn: () => frameService.list(params),
  });
}

export function useFrame(
  id: string,
  options?: Omit<UseQueryOptions<FrameDto>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: frameKeys.detail(id),
    queryFn: () => frameService.get(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateFrame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFramePayload) => frameService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: frameKeys.lists() });
    },
  });
}

export function useUpdateFrame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFramePayload }) =>
      frameService.update(id, data),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: frameKeys.lists() });
      void qc.invalidateQueries({ queryKey: frameKeys.detail(vars.id) });
    },
  });
}

export function useDeleteFrame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => frameService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: frameKeys.lists() });
    },
  });
}

export function useUploadFrameAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      kind,
      file,
    }: {
      id: string;
      kind: FrameAssetKind;
      file: File;
    }) => frameService.uploadAsset(id, kind, file),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: frameKeys.detail(vars.id) });
    },
  });
}
