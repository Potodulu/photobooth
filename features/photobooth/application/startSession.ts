import { experienceService } from "@/features/photobooth/services/api";
import { useSessionStore } from "@/features/photobooth/stores";
import { purgeAfterDownloadOrCancel } from "./retention";

export async function startGuestSession() {
  const experience = await experienceService.getBySlug("online-guest-demo");
  if (!experience) {
    throw new Error("Guest experience not found");
  }

  const store = useSessionStore.getState();
  store.setExperienceId(experience.id);
  store.acceptStorageWarning();
  return experience;
}

export async function cancelGuestSession() {
  await purgeAfterDownloadOrCancel();
}
