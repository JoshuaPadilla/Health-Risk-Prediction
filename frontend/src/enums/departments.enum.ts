export const Departments = {
	COM: "COM",
	CCIS: "CCIS",
	CAT: "CAT",
	CEA: "CEA",
	CCJS: "CCJS",
	COED: "COED",
	CON: "CON",
} as const;

export type Department = (typeof Departments)[keyof typeof Departments];
