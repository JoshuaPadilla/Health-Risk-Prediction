export const Models = {
	LOGISTIC: "logistic",
	SVM: "svm",
	FOREST: "forest",
} as const;

export type Model = (typeof Models)[keyof typeof Models];
