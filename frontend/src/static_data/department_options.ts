import {
	GraduationCap,
	Landmark,
	Leaf,
	Scale,
	School,
	Stethoscope,
	Wrench,
} from "lucide-react";

import type { Department } from "@/enums/departments.enum";

type DepartmentOption = {
	value: Department;
	label: string;
	description: string;
	logoLabel: string;
	icon: typeof GraduationCap;
};

export const DepartmentOptions: DepartmentOption[] = [
	{
		value: "COM",
		label: "College of Management",
		description: "COM",
		logoLabel: "COM logo placeholder",
		icon: Landmark,
	},
	{
		value: "CCIS",
		label: "College of Computing and Information Sciences",
		description: "CCIS",
		logoLabel: "CCIS logo placeholder",
		icon: GraduationCap,
	},
	{
		value: "CAT",
		label: "College of Agriculture and Technology",
		description: "CAT",
		logoLabel: "CAT logo placeholder",
		icon: Leaf,
	},
	{
		value: "CEA",
		label: "College of Engineering and Architecture",
		description: "CEA",
		logoLabel: "CEA logo placeholder",
		icon: Wrench,
	},
	{
		value: "CCJS",
		label: "College of Criminal Justice and Sciences",
		description: "CCJS",
		logoLabel: "CCJS logo placeholder",
		icon: Scale,
	},
	{
		value: "COED",
		label: "College of Education",
		description: "COED",
		logoLabel: "COED logo placeholder",
		icon: School,
	},
	{
		value: "CON",
		label: "College of Nursing",
		description: "CON",
		logoLabel: "CON logo placeholder",
		icon: Stethoscope,
	},
];
