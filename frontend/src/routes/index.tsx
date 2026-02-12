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
import { motion, type Variants } from "framer-motion";
import hero_image from "../../public/homepage-image.png";

export const Route = createFileRoute("/")({
	component: Home,
});

// --- Animation Variants ---

const fadeInUp: Variants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const staggerContainer: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
			delayChildren: 0.2,
		},
	},
};

const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.5 },
	},
};

const float: Variants = {
	animate: {
		y: [0, -15, 0],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
};

function Home() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white text-slate-900 font-sans flex flex-col px-4 md:px-32 overflow-hidden">
			<main className="flex-1">
				{/* --- Hero Section --- */}
				<section className="container mx-auto py-12 md:py-16 lg:py-24 xl:py-28">
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
						{/* Left Content */}
						<motion.div
							className="space-y-6 md:space-y-8 max-w-2xl"
							variants={staggerContainer}
							initial="hidden"
							animate="visible"
						>
							{/* Badge */}
							<motion.div variants={fadeInUp}>
								<div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 text-xs font-bold text-blue-700 uppercase tracking-wider shadow-sm hover:shadow-md transition-shadow">
									<GraduationCap className="h-4 w-4" />
									Thesis of Group 2
								</div>
							</motion.div>

							{/* Heading */}
							<motion.h1
								className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
								variants={fadeInUp}
							>
								Predict Your <br />
								<span className="relative inline-block">
									Health Risks
									<motion.svg
										className="absolute -bottom-2 left-0 w-full h-3 text-blue-200"
										viewBox="0 0 300 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<motion.path
											d="M2 10C50 5 100 2 150 5C200 8 250 3 298 7"
											stroke="currentColor"
											strokeWidth="3"
											strokeLinecap="round"
											initial={{ pathLength: 0 }}
											animate={{ pathLength: 1 }}
											transition={{
												duration: 1,
												delay: 0.8,
												ease: "easeInOut",
											}}
										/>
									</motion.svg>
								</span>{" "}
								<br />
								with{" "}
								<span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
									AI
								</span>
							</motion.h1>

							{/* Subtext */}
							<motion.p
								className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed"
								variants={fadeInUp}
							>
								Advanced Health Risk Prediction for NWSSU
								Students. Powered by state-of-the-art AI
								benchmarked models to ensure accuracy and
								privacy.
							</motion.p>

							{/* Buttons */}
							<motion.div
								className="flex flex-col sm:flex-row gap-4 pt-2"
								variants={fadeInUp}
							>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size="lg"
										className="group h-12 md:h-14 w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 md:px-8 text-base font-semibold shadow-lg shadow-blue-600/30"
										onClick={() =>
											navigate({ to: "/predict" })
										}
									>
										Start Prediction
										<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
									</Button>
								</motion.div>

								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										size="lg"
										className="h-12 md:h-14 w-full sm:w-auto px-6 md:px-8 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-base font-semibold shadow-sm hover:bg-slate-50 hover:border-slate-300"
									>
										Learn Methodology
									</Button>
								</motion.div>
							</motion.div>

							{/* Footer note */}
							<motion.div
								className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400"
								variants={fadeInUp}
							>
								<Sparkles className="h-4 w-4 text-blue-400" />
								Takes approx a few seconds to complete.
							</motion.div>
						</motion.div>

						{/* Right Image/Visual */}
						<motion.div
							className="relative w-full flex justify-center lg:justify-end"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.8,
								ease: "easeOut",
								delay: 0.2,
							}}
						>
							{/* Floating particles effect */}
							<div className="absolute inset-0 overflow-hidden pointer-events-none">
								<motion.div
									className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
									animate={{
										y: [0, -20, 0],
										opacity: [0.6, 1, 0.6],
									}}
									transition={{
										duration: 4,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								/>
								<motion.div
									className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-40"
									animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
									transition={{
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									}}
								/>
								<motion.div
									className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-500 rounded-full opacity-50"
									animate={{ y: [0, -25, 0] }}
									transition={{
										duration: 3.5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 0.5,
									}}
								/>
							</div>

							{/* Image Container with Float Animation */}
							<motion.div
								className="w-full max-w-[600px] relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 bg-slate-900 ring-1 ring-slate-900/5 z-10"
								variants={float}
								animate="animate"
								whileHover={{
									scale: 1.02,
									transition: { duration: 0.3 },
								}}
							>
								<img
									src={hero_image}
									className="w-full h-auto object-cover"
									alt="AI Health Analysis Dashboard"
								/>

								{/* Animated sheen on hover */}
								<motion.div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
							</motion.div>

							{/* Decorative background element */}
							<motion.div
								className="absolute -inset-8 -z-10 bg-gradient-to-tr from-blue-100 via-blue-50 to-transparent rounded-full blur-3xl opacity-60"
								animate={{
									scale: [1, 1.1, 1],
									opacity: [0.5, 0.7, 0.5],
								}}
								transition={{
									duration: 8,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						</motion.div>
					</div>
				</section>

				{/* --- Features Section --- */}
				<section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 border-y border-slate-100">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={fadeInUp}
						>
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
						</motion.div>

						<motion.div
							className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
							variants={staggerContainer}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-50px" }}
						>
							{/* Feature 1 */}
							<motion.div
								className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm"
								variants={fadeInUp}
								whileHover={{
									y: -8,
									boxShadow:
										"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
								}}
							>
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
							</motion.div>

							{/* Feature 2 */}
							<motion.div
								className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm"
								variants={fadeInUp}
								whileHover={{
									y: -8,
									boxShadow:
										"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
								}}
							>
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
							</motion.div>

							{/* Feature 3 */}
							<motion.div
								className="group bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm sm:col-span-2 lg:col-span-1"
								variants={fadeInUp}
								whileHover={{
									y: -8,
									boxShadow:
										"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
								}}
							>
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
							</motion.div>
						</motion.div>

						{/* --- Steps Process --- */}
						<div className="mt-20 md:mt-32 max-w-5xl mx-auto px-4 sm:px-6">
							<motion.div
								className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-slate-100"
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.6 }}
							>
								<motion.div
									className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6"
									variants={staggerContainer}
									initial="hidden"
									whileInView="visible"
									viewport={{ once: true }}
								>
									{/* Step 1 */}
									<motion.div
										className="group flex flex-col items-center text-center gap-3 flex-1"
										variants={scaleIn}
									>
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
									</motion.div>

									{/* Arrow 1 */}
									<motion.div
										className="hidden md:flex items-center flex-shrink-0"
										initial={{ opacity: 0, x: -10 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.3 }}
									>
										<ArrowRight className="h-6 w-6 text-slate-300" />
									</motion.div>
									<div className="md:hidden h-8 w-0.5 bg-slate-200"></div>

									{/* Step 2 */}
									<motion.div
										className="group flex flex-col items-center text-center gap-3 flex-1"
										variants={scaleIn}
									>
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
									</motion.div>

									{/* Arrow 2 */}
									<motion.div
										className="hidden md:flex items-center flex-shrink-0"
										initial={{ opacity: 0, x: -10 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 }}
									>
										<ArrowRight className="h-6 w-6 text-slate-300" />
									</motion.div>
									<div className="md:hidden h-8 w-0.5 bg-slate-200"></div>

									{/* Step 3 */}
									<motion.div
										className="group flex flex-col items-center text-center gap-3 flex-1"
										variants={scaleIn}
									>
										<div className="relative">
											<div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
												<Activity className="h-8 w-8 md:h-10 md:w-10 text-white" />
											</div>
											<motion.div
												className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
												animate={{ y: [0, -4, 0] }}
												transition={{
													repeat: Infinity,
													duration: 2,
												}}
											>
												3
											</motion.div>
										</div>
										<span className="font-heading font-bold text-base md:text-lg tracking-tight text-blue-600">
											Get Profile
										</span>
									</motion.div>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</section>
			</main>

			{/* --- Footer --- */}
			<motion.footer
				className="border-t border-slate-100 py-8 md:py-12 bg-white"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
						<div className="flex items-center gap-2 font-heading font-bold group">
							<motion.div
								className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg"
								whileHover={{ rotate: 10, scale: 1.1 }}
							>
								<img
									src="/BioMetric_logo.png"
									alt="BioMetric Logo"
									className="h-5 w-5 md:h-6 md:w-6 object-contain"
								/>
							</motion.div>
							<span className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground">
								BioMetric
							</span>
						</div>

						<div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-slate-500 font-medium">
							{[
								"Privacy Policy",
								"Terms of Use",
								"Contact Support",
							].map((item) => (
								<Link
									key={item}
									to="/"
									className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4"
								>
									{item}
								</Link>
							))}
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
			</motion.footer>
		</div>
	);
}
