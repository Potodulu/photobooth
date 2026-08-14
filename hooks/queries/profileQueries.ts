"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile";
import type { UpdateProfilePayload } from "@/types";

export const profileKeys = {
  me: ["profile", "me"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: () => profileService.get(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => profileService.update(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}

export function useUpdateEmail() {
  return useMutation({
    mutationFn: (data: { email: string; current_password?: string }) =>
      profileService.updateEmail(data),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      profileService.changePassword(data),
  });
}
