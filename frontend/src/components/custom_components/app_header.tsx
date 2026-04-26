import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { BarChart2, Home, Info, Menu, Zap } from "lucide-react";
import { useState } from "react";

const navItems = [
	{ label: "Home", href: "/", icon: Home },
	{
		label: "Model Benchmarking",
		href: "/model-benchmarking",
		icon: BarChart2,
	},
	{ label: "Predict", href: "/predict", icon: Zap },
	{ label: "About", href: "/about", icon: Info },
];

export default function AppHeader() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0B1120]/90 backdrop-blur-md px-4 md:px-8">
			<div className="container mx-auto flex h-20 items-center justify-between">
				{/* --- LEFT SIDE: LOGO --- */}
				<Link
					to="/"
					className="flex items-center gap-3 transition-opacity hover:opacity-90"
				>
					<div className="bg-gradient-to-br from-teal-400 to-blue-600 p-1.5 rounded-lg shadow-lg shadow-teal-900/20">
						<img
							src="/BioMetric_logo.png"
							alt="BioMetric Logo"
							className="h-6 w-6 object-contain brightness-0 invert"
						/>
					</div>
					<span className="font-heading text-xl font-bold tracking-tight text-white hidden sm:block">
						BioMetric
					</span>
				</Link>

				{/* --- RIGHT SIDE: DESKTOP NAV --- */}
				<nav className="hidden md:flex items-center gap-6">
					<div className="flex items-center gap-1">
						{navItems.map((item) => (
							<Link
								key={item.label}
								to={item.href}
								className="px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:text-white hover:bg-white/5 rounded-md"
								activeProps={{
									className:
										"text-white bg-white/10 font-semibold shadow-sm",
								}}
							>
								{item.label}
							</Link>
						))}
					</div>
				</nav>

				{/* --- RIGHT SIDE: MOBILE TOGGLE --- */}
				<div className="md:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="text-slate-300 hover:text-white hover:bg-white/10"
								aria-label="Toggle Menu"
							>
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>

						<SheetContent
							side="right"
							className="flex flex-col w-[300px] border-l border-slate-800 bg-[#0B1120] text-slate-100 sm:w-[350px]"
						>
							<SheetHeader className="text-left border-b border-slate-800 pb-6">
								<SheetTitle className="flex items-center gap-3 text-white">
									<div className="bg-gradient-to-br from-teal-400 to-blue-600 p-1.5 rounded-md">
										<img
											src="/BioMetric_logo.png"
											alt="Logo"
											className="h-5 w-5 brightness-0 invert"
										/>
									</div>
									<span className="font-heading font-bold text-lg">
										BioMetric
									</span>
								</SheetTitle>
								<SheetDescription className="sr-only">
									Mobile navigation menu
								</SheetDescription>
							</SheetHeader>

							{/* Mobile Links */}
							<nav className="flex flex-col gap-2 mt-6 flex-1">
								{navItems.map((item) => (
									<Link
										key={item.label}
										to={item.href}
										className="group flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-400 transition-all hover:text-teal-400 hover:bg-white/5 rounded-lg"
										activeProps={{
											className:
												"text-teal-400 bg-teal-400/10 font-semibold border-l-2 border-teal-400 rounded-l-none",
										}}
										onClick={() => setIsOpen(false)}
									>
										<item.icon className="h-5 w-5 transition-colors group-hover:text-teal-400" />
										{item.label}
									</Link>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
