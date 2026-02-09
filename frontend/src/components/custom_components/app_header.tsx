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
	{ label: "Assess", href: "/assess" },
	{ label: "About", href: "/about" },
];

export default function AppHeader() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-8">
			<div className="container flex h-16 items-center justify-between">
				{/* --- LEFT SIDE: LOGO --- */}
				<Link
					to="/"
					className="flex items-center gap-2 transition-opacity hover:opacity-90"
				>
					<img
						src="/BioMetric_logo.png"
						alt="BioMetric Logo"
						className="h-8 w-8 object-contain"
					/>
					<span className="font-heading text-xl font-bold tracking-tight text-foreground">
						BioMetric
					</span>
				</Link>

				{/* --- RIGHT SIDE: DESKTOP NAV --- */}
				<nav className="hidden md:flex">
					<NavigationMenu>
						<NavigationMenuList>
							{navItems.map((item) => (
								<NavigationMenuItem key={item.label}>
									<Link
										to={item.href}
										className={navigationMenuTriggerStyle()}
										// TanStack Router handles active class automatically via activeProps
										activeProps={{
											className:
												"bg-accent text-accent-foreground",
										}}
									>
										{item.label}
									</Link>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</nav>

				{/* --- RIGHT SIDE: MOBILE TOGGLE --- */}
				<div className="md:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="-mr-2"
								aria-label="Toggle Menu"
							>
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="w-[250px] sm:w-[300px]"
						>
							<SheetHeader>
								<SheetTitle className="text-left font-heading font-bold flex items-center gap-2">
									<img
										src="/BioMetric_logo.png"
										alt="Logo"
										className="h-6 w-6"
									/>
									BioMetric
								</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-4 mt-8">
								{navItems.map((item) => (
									<Link
										key={item.label}
										to={item.href}
										className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors data-[status=active]:text-primary data-[status=active]:font-semibold"
										activeProps={{
											"data-status": "active", // Alternative way to handle active state
										}}
										onClick={() => setIsOpen(false)} // Closes menu on click
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
