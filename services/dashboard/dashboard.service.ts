import { API_ROUTES } from "@/constants/apiRoute";
import { apiClient } from "@/libs/api";
import type { DashboardStatsDto } from "@/types";

export const dashboardService = {
  getStats(): Promise<DashboardStatsDto> {
    return apiClient.get<DashboardStatsDto>(API_ROUTES.DASHBOARD.STATS);
  },
};
