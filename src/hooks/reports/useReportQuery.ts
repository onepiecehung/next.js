import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { ReportsAPI } from "@/lib/api/reports";
import type {
  CreateReportDto,
  QueryReportsDto,
  UpdateReportDto,
  ResolveReportDto,
  AssignReportDto,
  DismissReportDto,
  EscalateReportDto,
  MergeReportsDto,
} from "@/lib/api/reports";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching reports with pagination and filtering
 */
export function useReports(params?: QueryReportsDto) {
  return useQuery({
    queryKey: queryKeys.reports.list(params),
    queryFn: () => ReportsAPI.getReports(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching a single report by ID
 */
export function useReport(reportId: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(reportId),
    queryFn: () => ReportsAPI.getReport(reportId),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching report statistics
 */
export function useReportStats(params?: QueryReportsDto) {
  return useQuery({
    queryKey: queryKeys.reports.stats(params),
    queryFn: () => ReportsAPI.getReportStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching my reports (for regular users)
 */
export function useMyReports(params?: Omit<QueryReportsDto, "userId">) {
  return useQuery({
    queryKey: queryKeys.reports.my(params),
    queryFn: () => ReportsAPI.getMyReports(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching assigned reports (for moderators)
 */
export function useAssignedReports(
  params?: Omit<QueryReportsDto, "moderatorId">,
) {
  return useQuery({
    queryKey: queryKeys.reports.assigned(params),
    queryFn: () => ReportsAPI.getAssignedReports(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching pending reports (for moderators)
 */
export function usePendingReports(params?: Omit<QueryReportsDto, "status">) {
  return useQuery({
    queryKey: queryKeys.reports.pending(params),
    queryFn: () => ReportsAPI.getPendingReports(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching urgent reports (for moderators)
 */
export function useUrgentReports(params?: Omit<QueryReportsDto, "priority">) {
  return useQuery({
    queryKey: queryKeys.reports.urgent(params),
    queryFn: () => ReportsAPI.getUrgentReports(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching reports for specific content
 */
export function useReportsForContent(
  reportableType: string,
  reportableId: string,
) {
  return useQuery({
    queryKey: queryKeys.reports.forContent(reportableType, reportableId),
    queryFn: () =>
      ReportsAPI.getReportsForContent(reportableType, reportableId),
    enabled: !!reportableType && !!reportableId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching duplicate reports
 */
export function useDuplicateReports(
  reportableType: string,
  reportableId: string,
) {
  return useQuery({
    queryKey: queryKeys.reports.duplicates(reportableType, reportableId),
    queryFn: () => ReportsAPI.getDuplicateReports(reportableType, reportableId),
    enabled: !!reportableType && !!reportableId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a report
 */
export function useCreateReport() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportDto) => ReportsAPI.createReport(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.my({}),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.forContent(
          variables.reportableType,
          variables.reportableId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.stats({}),
      });
      toast.success(
        t("reportCreated", "reports") || "Report created successfully",
      );
    },
    onError: (error) => {
      console.error("Create report error:", error);
      toast.error(
        t("reportCreateError", "reports") || "Failed to create report",
      );
    },
  });
}

/**
 * Hook for updating a report
 */
export function useUpdateReport() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      data,
    }: {
      reportId: string;
      data: UpdateReportDto;
    }) => ReportsAPI.updateReport(reportId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.reports.detail(variables.reportId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.all(),
      });
      toast.success(
        t("reportUpdated", "reports") || "Report updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update report error:", error);
      toast.error(
        t("reportUpdateError", "reports") || "Failed to update report",
      );
    },
  });
}

/**
 * Hook for assigning a report to a moderator
 */
export function useAssignReport() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      moderatorId,
    }: {
      reportId: string;
      moderatorId: string;
    }) => ReportsAPI.assignReport(reportId, moderatorId),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.reports.detail(variables.reportId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.assigned({}),
      });
      toast.success(
        t("reportAssigned", "reports") || "Report assigned successfully",
      );
    },
    onError: (error) => {
      console.error("Assign report error:", error);
      toast.error(
        t("reportAssignError", "reports") || "Failed to assign report",
      );
    },
  });
}

/**
 * Hook for resolving a report
 */
export function useResolveReport() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      data,
    }: {
      reportId: string;
      data: ResolveReportDto;
    }) => ReportsAPI.resolveReport(reportId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.reports.detail(variables.reportId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.stats({}),
      });
      toast.success(
        t("reportResolved", "reports") || "Report resolved successfully",
      );
    },
    onError: (error) => {
      console.error("Resolve report error:", error);
      toast.error(
        t("reportResolveError", "reports") || "Failed to resolve report",
      );
    },
  });
}

/**
 * Hook for dismissing a report
 */
export function useDismissReport() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, reason }: { reportId: string; reason: string }) =>
      ReportsAPI.dismissReport(reportId, reason),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.reports.detail(variables.reportId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.stats({}),
      });
      toast.success(
        t("reportDismissed", "reports") || "Report dismissed successfully",
      );
    },
    onError: (error) => {
      console.error("Dismiss report error:", error);
      toast.error(
        t("reportDismissError", "reports") || "Failed to dismiss report",
      );
    },
  });
}

/**
 * Hook for escalating a report
 */
export function useEscalateReport() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, reason }: { reportId: string; reason: string }) =>
      ReportsAPI.escalateReport(reportId, reason),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.reports.detail(variables.reportId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.stats({}),
      });
      toast.success(
        t("reportEscalated", "reports") || "Report escalated successfully",
      );
    },
    onError: (error) => {
      console.error("Escalate report error:", error);
      toast.error(
        t("reportEscalateError", "reports") || "Failed to escalate report",
      );
    },
  });
}

/**
 * Hook for merging duplicate reports
 */
export function useMergeReports() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MergeReportsDto) =>
      ReportsAPI.mergeDuplicateReports(data.reportIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports.stats({}),
      });
      toast.success(
        t("reportsMerged", "reports") || "Reports merged successfully",
      );
    },
    onError: (error) => {
      console.error("Merge reports error:", error);
      toast.error(
        t("reportsMergeError", "reports") || "Failed to merge reports",
      );
    },
  });
}
