export const RecommendationStatuses = {
	SUCCESS: "success",
	DANGER: "danger",
	WARNING: "warning",
} as const;

export type RecommendationStatus =
	(typeof RecommendationStatuses)[keyof typeof RecommendationStatuses];
