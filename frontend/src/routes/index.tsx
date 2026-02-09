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
} from "lucide-react";
import hero_image from "../../public/homepage-image.png";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
			<main className="flex-1">
				{/* --- Hero Section --- */}
				<section className="container max-h-200 mx-auto px-4 py-12 md:py-20 lg:py-28">
					<div className="h-full grid lg:grid-cols-2 gap-12 lg:items-center">
						{/* Left Content */}
						<div className="space-y-8 max-w-2xl b">
							{/* Badge */}
							<div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
								<GraduationCap className="h-4 w-4" />
								Thesis of Group 2
							</div>

							{/* Heading */}
							<h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
								Predict Your <br />
								Health Risks <br />
								with <span className="text-blue-600">AI</span>
							</h1>

							{/* Subtext */}
							<p className="text-lg text-slate-500 max-w-lg leading-relaxed">
								Advanced Health Risk Prediction for NWSSU
								Students. Powered by state-of-the-art AI
								benchmarking models to ensure accuracy and
								privacy.
							</p>

							{/* Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 pt-2">
								<Button
									size="lg"
									className="h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-8 text-base font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
									onClick={() => navigate({ to: "/assess" })}
								>
									Start Assessment{" "}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="h-12 px-8 rounded-lg border-slate- bg-white text-slate-900 text-base font-semibold shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg hover:bg-slate-50 active:scale-[0.98]
								"
								>
									Learn Methodology
								</Button>
							</div>

							{/* Footer note */}
							<p className="text-xs font-medium text-slate-400">
								* Takes approx. 5 minutes to complete.
							</p>
						</div>

						{/* Right Image/Visual */}
						<div className="relative w-full flex justify-center lg:justify-start ">
							{/* Image Container matching the card look */}
							<div className="w-full p-4 relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 bg-slate-900 ring-1 ring-slate-900/5 group">
								{/* The actual image */}
								<img
									src={hero_image}
									className="w-full h-auto max-w-[600px] object-cover transition-transform duration-700 group-hover:scale-140"
									alt="AI Health Analysis Dashboard"
								/>

								{/* Optional overlay if your image is transparent and needs the dark gradient bg from the screenshot */}
							</div>

							{/* Decorative background element behind the image */}
							<div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-blue-100 to-white rounded-full blur-3xl opacity-60" />
						</div>
					</div>
				</section>

				{/* --- Features Section --- */}
				<section className="bg-slate-50 py-24 border-y border-slate-100">
					<div className="container mx-auto px-4">
						<div className="text-center max-w-2xl mx-auto mb-16">
							<h2 className="font-heading text-3xl font-bold mb-4 text-slate-900">
								Why use this tool?
							</h2>
							<p className="text-slate-500 text-lg">
								Our system leverages advanced machine learning
								to provide accurate, data-driven health risk
								assessments tailored for the student body.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{/* Feature 1 */}
							<div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
								<div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
									<BarChart3 className="h-6 w-6" />
								</div>
								<h3 className="font-heading font-bold text-xl mb-3 text-slate-900">
									AI Benchmarking
								</h3>
								<p className="text-slate-500 leading-relaxed">
									We compare results across multiple
									predictive models (Random Forest, Neural
									Networks) to ensure the highest possible
									accuracy for your profile.
								</p>
							</div>

							{/* Feature 2 */}
							<div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
								<div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
									<ShieldCheck className="h-6 w-6" />
								</div>
								<h3 className="font-heading font-bold text-xl mb-3 text-slate-900">
									Secure Data
								</h3>
								<p className="text-slate-500 leading-relaxed">
									Your health data is strictly anonymized and
									protected according to university data
									privacy standards. No personal identifiers
									are stored publicly.
								</p>
							</div>

							{/* Feature 3 */}
							<div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
								<div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
									<Zap className="h-6 w-6" />
								</div>
								<h3 className="font-heading font-bold text-xl mb-3 text-slate-900">
									Instant Results
								</h3>
								<p className="text-slate-500 leading-relaxed">
									Receive a comprehensive risk profile in
									seconds. Get actionable insights immediately
									after completing the assessment
									questionnaire.
								</p>
							</div>
						</div>

						{/* --- Steps Process --- */}
						{/* --- Steps Process --- */}
						<div className="mt-32 w-full px-12 mx-auto">
							<div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-slate-500">
								{/* Step 1 */}
								<div className="flex items-center gap-4">
									<div className="text-slate-500">
										<FileText className="h-8 w-8 md:h-10 md:w-10" />
									</div>
									<span className="font-heading font-bold text-lg md:text-xl tracking-tight text-slate-500">
										1. Input Data
									</span>
								</div>

								{/* Line 1 */}
								<div className="hidden md:block h-[2px] w-16 bg-slate-200 rounded-full" />

								{/* Step 2 */}
								<div className="flex items-center gap-4">
									<div className="text-slate-500">
										<BrainCircuit className="h-8 w-8 md:h-10 md:w-10" />
									</div>
									<span className="font-heading font-bold text-lg md:text-xl tracking-tight text-slate-500">
										2. AI Analysis
									</span>
								</div>

								{/* Line 2 */}
								<div className="hidden md:block h-[2px] w-16 bg-slate-200 rounded-full" />

								{/* Step 3 */}
								<div className="flex items-center gap-4">
									<div className="text-blue-600">
										<Activity className="h-8 w-8 md:h-10 md:w-10" />
									</div>
									<span className="font-heading font-bold text-lg md:text-xl tracking-tight text-blue-600">
										3. Get Profile
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* --- Footer --- */}
			<footer className="border-t border-slate-100 py-12 bg-white">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
						<div className="flex items-center gap-2 font-heading font-bold">
							<div className="h-6 w-6 bg-slate-900 rounded-md flex items-center justify-center">
								<span className="text-white text-xs font-bold">
									+
								</span>
							</div>
							<span className="text-sm text-slate-900">
								NWSSU Health AI
							</span>
						</div>

						<div className="flex gap-8 text-sm text-slate-500 font-medium">
							<Link
								to="/"
								className="hover:text-slate-900 transition-colors"
							>
								Privacy Policy
							</Link>
							<Link
								to="/"
								className="hover:text-slate-900 transition-colors"
							>
								Terms of Use
							</Link>
							<Link
								to="/"
								className="hover:text-slate-900 transition-colors"
							>
								Contact Support
							</Link>
						</div>
					</div>

					<div className="border-t border-slate-100 pt-8 text-center md:text-left">
						<p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
							<span className="font-semibold text-slate-500">
								Disclaimer:
							</span>{" "}
							The NWSSU Health AI tool is for informational
							purposes only and is not a substitute for
							professional medical diagnosis, advice, or
							treatment. Always seek the advice of your physician
							or other qualified health provider with any
							questions you may have regarding a medical
							condition.
						</p>
						<p className="text-xs text-slate-300 mt-4">
							© 2023 Northwest Samar State University. All rights
							reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
