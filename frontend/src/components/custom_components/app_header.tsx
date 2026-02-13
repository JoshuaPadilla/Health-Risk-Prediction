import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navItems = [
	{ label: "Home", href: "/" },
	{ label: "Model Benchmarking", href: "/model-benchmarking" },
	{ label: "Predict", href: "/predict" },
	{ label: "About", href: "/about" },
];

export default function AppHeader() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		// Changed to dark background to match the Hero section
		<header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0B1120]/90 backdrop-blur-md px-4 md:px-8">
			<div className="container mx-auto flex h-20 items-center justify-between">
				{/* --- LEFT SIDE: LOGO --- */}
				<Link
					to="/"
					className="flex items-center gap-3 transition-opacity hover:opacity-90"
				>
					{/* Assuming logo has a transparent bg. If not, you might need a white version */}
					<div className="bg-gradient-to-br from-teal-400 to-blue-600 p-1.5 rounded-lg">
						<img
							src="/BioMetric_logo.png"
							alt="BioMetric Logo"
							className="h-6 w-6 object-contain brightness-0 invert"
						/>
					</div>
					<span className="font-heading text-xl font-bold tracking-tight text-white">
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
								className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white hover:bg-white/10 rounded-md"
								activeProps={{
									className:
										"text-white bg-white/10 font-semibold",
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
							className="w-[300px] border-slate-800 bg-[#0B1120] text-slate-100"
						>
							<SheetHeader>
								<SheetTitle className="text-left font-heading font-bold flex items-center gap-2 text-white">
									BioMetric
								</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-4 mt-8">
								{navItems.map((item) => (
									<Link
										key={item.label}
										to={item.href}
										className="text-lg font-medium text-slate-400 hover:text-teal-400 transition-colors"
										activeProps={{
											className:
												"text-teal-400 font-semibold",
										}}
										onClick={() => setIsOpen(false)}
									>
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
