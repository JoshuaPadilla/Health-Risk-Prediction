import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ShieldCheck,
	Zap,
	BarChart3,
	FileText,
	BrainCircuit,
	Activity,
	ArrowRight,
	GraduationCap,
	Sparkles,
} from "lucide-react";
import hero_image from "../../public/homepage-image.png";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-linear-to-b from-white via-blue-50/30 to-white text-slate-900 font-sans flex flex-col px-32">
			<main className="flex-1">
				{/* --- Hero Section --- */}
				<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 xl:py-28">
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
						{/* Left Content */}
						<div className="space-y-6 md:space-y-8 max-w-2xl animate-fade-in-up">
							{/* Badge */}
							<div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 text-xs font-bold text-blue-700 uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
								<GraduationCap className="h-4 w-4 animate-bounce-subtle" />
								Thesis of Group 2
							</div>

							{/* Heading */}
							<h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
								Predict Your <br />
								<span className="relative inline-block">
									Health Risks
									<svg
										className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 animate-draw-line"
										viewBox="0 0 300 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M2 10C50 5 100 2 150 5C200 8 250 3 298 7"
											stroke="currentColor"
											strokeWidth="3"
											strokeLinecap="round"
										/>
									</svg>
								</span>{" "}
								<br />
								with{" "}
								<span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent animate-gradient">
									AI
								</span>
							</h1>

							{/* Subtext */}
							<p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
								Advanced Health Risk Prediction for NWSSU
								Students. Powered by state-of-the-art AI
								benchmarked models to ensure accuracy and
								privacy.
							</p>

							{/* Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 pt-2">
								<Button
									size="lg"
									className="group h-12 md:h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 md:px-8 text-base font-semibold shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/40"
									onClick={() => navigate({ to: "/predict" })}
								>
									Start Prediction
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="h-12 md:h-14 px-6 md:px-8 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-base font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
								>
									Learn Methodology
								</Button>
							</div>

							{/* Footer note */}
							<div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400 animate-pulse-subtle">
								<Sparkles className="h-4 w-4 text-blue-400" />
								Takes approx a few seconds to complete.
							</div>
						</div>

						{/* Right Image/Visual */}
						<div className="relative w-full flex justify-center lg:justify-end animate-fade-in-right">
							{/* Floating particles effect */}
							<div className="absolute inset-0 overflow-hidden pointer-events-none">
								<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float-slow opacity-60"></div>
								<div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-300 rounded-full animate-float-medium opacity-40"></div>
								<div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-float-fast opacity-50"></div>
							</div>

							{/* Image Container */}
							<div className="w-full max-w-[600px] relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 bg-slate-900 ring-1 ring-slate-900/5 group transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl hover:shadow-blue-500/20">
								{/* The actual image */}
								<img
									src={hero_image}
									className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
									alt="AI Health Analysis Dashboard"
								/>

								{/* Animated border gradient */}
								<div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-blue-500/20 via-transparent to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
							</div>

							{/* Decorative background element */}
							<div className="absolute -inset-8 -z-10 bg-gradient-to-tr from-blue-100 via-blue-50 to-transparent rounded-full blur-3xl opacity-60 animate-pulse-slow" />
						</div>
					</div>
				</section>

				{/* --- Features Section --- */}
				<section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 border-y border-slate-100">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in">
							<div className="inline-block mb-4">
								<span className="text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-1.5 rounded-full">
									Features
								</span>
							</div>
							<h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-slate-900">
								Why use this tool?
							</h2>
							<p className="text-slate-600 text-base md:text-lg leading-relaxed">
								Our system leverages advanced machine learning
								to provide accurate, data-driven health risk
								assessments tailored for the student body.
							</p>
						</div>

						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{/* Feature 1 */}
							<div className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-100">
								<div className="h-12 w-12 md:h-14 md:w-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
									<BarChart3 className="h-6 w-6 md:h-7 md:w-7" />
								</div>
								<h3 className="font-heading font-bold text-xl md:text-2xl mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
									AI Benchmarking
								</h3>
								<p className="text-slate-600 leading-relaxed text-sm md:text-base">
									We compare results across multiple
									predictive models (Random Forest, Neural
									Networks) to ensure the highest possible
									accuracy for your profile.
								</p>
							</div>

							{/* Feature 2 */}
							<div className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-200">
								<div className="h-12 w-12 md:h-14 md:w-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
									<ShieldCheck className="h-6 w-6 md:h-7 md:w-7" />
								</div>
								<h3 className="font-heading font-bold text-xl md:text-2xl mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
									Secure Data
								</h3>
								<p className="text-slate-600 leading-relaxed text-sm md:text-base">
									Your health data is strictly anonymized and
									protected according to university data
									privacy standards. No personal identifiers
									are stored publicly.
								</p>
							</div>

							{/* Feature 3 */}
							<div className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-300 sm:col-span-2 lg:col-span-1">
								<div className="h-12 w-12 md:h-14 md:w-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
									<Zap className="h-6 w-6 md:h-7 md:w-7" />
								</div>
								<h3 className="font-heading font-bold text-xl md:text-2xl mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
									Instant Results
								</h3>
								<p className="text-slate-600 leading-relaxed text-sm md:text-base">
									Receive a comprehensive risk profile in
									seconds. Get actionable insights immediately
									after completing the assessment
									questionnaire.
								</p>
							</div>
						</div>

						{/* --- Steps Process --- */}
						<div className="mt-20 md:mt-32 max-w-5xl mx-auto px-4 sm:px-6">
							<div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-slate-100">
								<div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
									{/* Step 1 */}
									<div className="group flex flex-col items-center text-center gap-3 flex-1 animate-fade-in-up animation-delay-100">
										<div className="relative">
											<div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
												<FileText className="h-8 w-8 md:h-10 md:w-10 text-slate-600" />
											</div>
											<div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
												1
											</div>
										</div>
										<span className="font-heading font-bold text-base md:text-lg tracking-tight text-slate-700">
											Input Data
										</span>
									</div>

									{/* Arrow 1 */}
									<div className="hidden md:flex items-center flex-shrink-0">
										<ArrowRight className="h-6 w-6 text-slate-300 animate-pulse-subtle" />
									</div>
									<div className="md:hidden">
										<div className="h-8 w-0.5 bg-slate-200"></div>
									</div>

									{/* Step 2 */}
									<div className="group flex flex-col items-center text-center gap-3 flex-1 animate-fade-in-up animation-delay-200">
										<div className="relative">
											<div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
												<BrainCircuit className="h-8 w-8 md:h-10 md:w-10 text-blue-700" />
											</div>
											<div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
												2
											</div>
										</div>
										<span className="font-heading font-bold text-base md:text-lg tracking-tight text-slate-700">
											AI Analysis
										</span>
									</div>

									{/* Arrow 2 */}
									<div className="hidden md:flex items-center flex-shrink-0">
										<ArrowRight className="h-6 w-6 text-slate-300 animate-pulse-subtle" />
									</div>
									<div className="md:hidden">
										<div className="h-8 w-0.5 bg-slate-200"></div>
									</div>

									{/* Step 3 */}
									<div className="group flex flex-col items-center text-center gap-3 flex-1 animate-fade-in-up animation-delay-300">
										<div className="relative">
											<div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
												<Activity className="h-8 w-8 md:h-10 md:w-10 text-white" />
											</div>
											<div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-bounce-subtle">
												3
											</div>
										</div>
										<span className="font-heading font-bold text-base md:text-lg tracking-tight text-blue-600">
											Get Profile
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* --- Footer --- */}
			<footer className="border-t border-slate-100 py-8 md:py-12 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
						<div className="flex items-center gap-2 font-heading font-bold group">
							<div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
								<img
									src="/BioMetric_logo.png"
									alt="BioMetric Logo"
									className="h-5 w-5 md:h-6 md:w-6 object-contain"
								/>
							</div>
							<span className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground">
								BioMetric
							</span>
						</div>

						<div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-slate-500 font-medium">
							<Link
								to="/"
								className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4"
							>
								Privacy Policy
							</Link>
							<Link
								to="/"
								className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4"
							>
								Terms of Use
							</Link>
							<Link
								to="/"
								className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4"
							>
								Contact Support
							</Link>
						</div>
					</div>

					<div className="border-t border-slate-100 pt-6 md:pt-8 text-center md:text-left">
						<p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-4xl mx-auto md:mx-0">
							<span className="font-semibold text-slate-700">
								Disclaimer:
							</span>{" "}
							BioMetric is for informational purposes only and is
							not a substitute for professional medical diagnosis,
							advice, or treatment. Always seek the advice of your
							physician or other qualified health provider with
							any questions you may have regarding a medical
							condition.
						</p>
						<p className="text-xs text-slate-400 mt-4">
							© 2024 BioMetric. All rights reserved.
						</p>
					</div>
				</div>
			</footer>

			{/* Add custom animations in your global CSS or Tailwind config */}
			<style>{`
				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fade-in-right {
					from {
						opacity: 0;
						transform: translateX(-20px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes bounce-subtle {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-5px);
					}
				}

				@keyframes pulse-subtle {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.8;
					}
				}

				@keyframes pulse-slow {
					0%,
					100% {
						opacity: 0.6;
					}
					50% {
						opacity: 0.8;
					}
				}

				@keyframes float-slow {
					0%,
					100% {
						transform: translate(0, 0);
					}
					50% {
						transform: translate(10px, -10px);
					}
				}

				@keyframes float-medium {
					0%,
					100% {
						transform: translate(0, 0);
					}
					50% {
						transform: translate(-15px, 15px);
					}
				}

				@keyframes float-fast {
					0%,
					100% {
						transform: translate(0, 0);
					}
					50% {
						transform: translate(12px, -12px);
					}
				}

				@keyframes draw-line {
					from {
						stroke-dasharray: 300;
						stroke-dashoffset: 300;
					}
					to {
						stroke-dasharray: 300;
						stroke-dashoffset: 0;
					}
				}

				@keyframes gradient {
					0%,
					100% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
				}

				.animate-fade-in-up {
					animation: fade-in-up 0.6s ease-out;
				}

				.animate-fade-in-right {
					animation: fade-in-right 0.8s ease-out;
				}

				.animate-fade-in {
					animation: fade-in 0.6s ease-out;
				}

				.animate-bounce-subtle {
					animation: bounce-subtle 2s ease-in-out infinite;
				}

				.animate-pulse-subtle {
					animation: pulse-subtle 2s ease-in-out infinite;
				}

				.animate-pulse-slow {
					animation: pulse-slow 4s ease-in-out infinite;
				}

				.animate-float-slow {
					animation: float-slow 6s ease-in-out infinite;
				}

				.animate-float-medium {
					animation: float-medium 5s ease-in-out infinite;
				}

				.animate-float-fast {
					animation: float-fast 4s ease-in-out infinite;
				}

				.animate-draw-line {
					animation: draw-line 1s ease-out 0.5s forwards;
				}

				.animate-gradient {
					background-size: 200% 200%;
					animation: gradient 3s ease infinite;
				}

				.animation-delay-100 {
					animation-delay: 100ms;
				}

				.animation-delay-200 {
					animation-delay: 200ms;
				}

				.animation-delay-300 {
					animation-delay: 300ms;
				}
			`}</style>
		</div>
	);
}
