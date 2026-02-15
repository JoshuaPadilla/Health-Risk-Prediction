import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter } from "lucide-react";

export const AppFooter = () => {
	return (
		<footer className="bg-[#0F172A] pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
			{/* Top Glow Separator */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

			{/* Ambient Background Glow */}
			<div className="absolute bottom-0 left-[-20%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

			<div className="container mx-auto px-4 md:px-12 relative z-10">
				<div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 mb-12">
					{/* Brand Section */}
					<div className="flex flex-col items-center md:items-start gap-4 max-w-sm text-center md:text-left">
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
						<p className="text-slate-400 text-sm leading-relaxed">
							Empowering your health journey with advanced AI
							prediction models and personalized wellness
							insights.
						</p>
					</div>

					{/* Social / Connect Section */}
					<div className="flex gap-4">
						{[Twitter, Github, Linkedin].map((Icon, i) => (
							<a
								key={i}
								href="#"
								className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-300"
							>
								<Icon className="h-4 w-4" />
							</a>
						))}
					</div>
				</div>

				{/* Divider */}
				<div className="h-px w-full bg-slate-800/50 mb-8" />

				{/* Bottom Legal Section */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
					<div>Copyright © 2026 BioMetric. All rights reserved.</div>

					<div className="flex gap-8 font-medium">
						<Link
							to="/"
							className="hover:text-teal-400 transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							to="/"
							className="hover:text-teal-400 transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							to="/"
							className="hover:text-teal-400 transition-colors"
						>
							Cookie Settings
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};
