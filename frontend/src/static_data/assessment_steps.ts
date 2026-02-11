import { Cpu, HeartPulse, Moon, User } from "lucide-react";

export const Assessment_Steps = [
	{
		id: 1,
		shortTitle: "01. Identity",
		title: "Demographics",
		icon: User,
		desc: "Basic biological identity factors.",
		image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 2,
		shortTitle: "02. Lifestyle",
		title: "Habits & Behavior",
		icon: Moon,
		desc: "Daily routines and stress factors.",
		image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 3,
		shortTitle: "03. Vitals",
		title: "Physical Status",
		icon: HeartPulse,
		desc: "Measurable physiological outcomes.",
		image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 4,
		shortTitle: "04. Analysis",
		title: "Model Selection",
		icon: Cpu,
		desc: "Choose the algorithm for prediction.",
		image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
	},
];
