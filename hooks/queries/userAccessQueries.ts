"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userAccessService } from "@/services/userAccess";
import { roleService } from "@/services/role";
import type {
  RoleCode,
  CreateUserPayload,
  UpdateUserPayload,
  CreateRolePayload,
  UpdateRolePayload,
} from "@/types";

export const userAccessKeys = {
  all: ["userAccess"] as const,
  list: (role?: RoleCode) => ["userAccess", "list", role] as const,
};

export const roleKeys = {
  all: ["roles"] as const,
  list: () => ["roles", "list"] as const,
};

export function useUserAccessList(role?: RoleCode) {
  return useQuery({
    queryKey: userAccessKeys.list(role),
    queryFn: () => userAccessService.list(role),
  });
}

export function useCreateUserAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) => userAccessService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: userAccessKeys.all });
    },
  });
}

export function useUpdateUserAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      userAccessService.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: userAccessKeys.all });
    },
  });
}

export function useInactivateUserAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userAccessService.inactivate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: userAccessKeys.all });
    },
  });
}

export function useRoleList() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () => roleService.list(),
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRolePayload) => roleService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRolePayload }) =>
      roleService.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}
