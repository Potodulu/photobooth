"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { layoutService } from "@/services/layout";
import type { ListParams } from "@/libs/api";
import type {
  CreateLayoutPayload,
  LayoutDto,
  UpdateLayoutPayload,
} from "@/types";

export const layoutKeys = {
  all: ["layouts"] as const,
  lists: () => [...layoutKeys.all, "list"] as const,
  list: (params?: ListParams) => [...layoutKeys.lists(), params] as const,
  details: () => [...layoutKeys.all, "detail"] as const,
  detail: (id: string) => [...layoutKeys.details(), id] as const,
};

export function useLayouts(params?: ListParams) {
  return useQuery({
    queryKey: layoutKeys.list(params),
    queryFn: () => layoutService.list(params),
  });
}

export function useLayout(
  id: string,
  options?: Omit<UseQueryOptions<LayoutDto>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: layoutKeys.detail(id),
    queryFn: () => layoutService.get(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateLayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLayoutPayload) => layoutService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: layoutKeys.lists() });
    },
  });
}

export function useUpdateLayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLayoutPayload }) =>
      layoutService.update(id, data),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: layoutKeys.lists() });
      void qc.invalidateQueries({ queryKey: layoutKeys.detail(vars.id) });
    },
  });
}

export function useDeleteLayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => layoutService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: layoutKeys.lists() });
    },
  });
}

export function useUploadLayoutPreview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      layoutService.uploadPreview(id, file),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: layoutKeys.detail(vars.id) });
    },
  });
}
