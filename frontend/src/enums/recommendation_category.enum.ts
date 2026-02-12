export const RecommendationCategories = {
	SLEEP: "Sleep",
	MENTAL: "Mental",
	PHYSICAL: "Physical",
	LIFESTYLE: "Lifestyle",
} as const;

export type RecommendationCategory =
	(typeof RecommendationCategories)[keyof typeof RecommendationCategories];
