import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ShieldCheck,
	Zap,
	BarChart3,
	FileText,
	BrainCircuit,
	ClipboardList,
	ArrowRight,
	Activity,
	Users,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import hero_image from "../../public/homepage-image.png";

// Ideally, import your Navbar and Footer components here if they exist externally
// import { Navbar } from "@/components/navbar";
// import { AppFooter } from "@/components/footer";

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
		<div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col overflow-x-hidden">
			<main className="flex-1">
				{/* --- Hero Section (Dark Theme) --- */}
				<section className="relative pt-12 pb-20 md:pt-16 md:pb-32 lg:pt-16 bg-[#0F172A] overflow-hidden">
					{/* Background Gradients */}
					<div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
					<div className="absolute bottom-[0%] right-[-5%] w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[100px] pointer-events-none" />

					{/* Grid Pattern Overlay */}
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

					<div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10">
						<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
							{/* Left Content */}
							<motion.div
								className="space-y-8 max-w-2xl"
								variants={staggerContainer}
								initial="hidden"
								animate="visible"
							>
								<motion.div
									variants={fadeInUp}
									className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest"
								>
									<span className="relative flex h-2 w-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
									</span>
									v2.0 Model Live
								</motion.div>

								<motion.h1
									className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
									variants={fadeInUp}
								>
									Predict Your{" "}
									<span className="text-white">Health</span>{" "}
									<br />
									<span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
										Risks
									</span>{" "}
									& Student <br />
									<span className="font-extrabold text-white">
										Performance
									</span>
								</motion.h1>

								<motion.p
									className="text-lg text-slate-400 max-w-lg leading-relaxed"
									variants={fadeInUp}
								>
									Advanced diagnostic support for NWSSU
									Students. Powered by state-of-the-art AI
									benchmarking models for accuracy, speed, and
									privacy.
								</motion.p>

								<motion.div
									className="flex flex-col sm:flex-row gap-4 pt-2"
									variants={fadeInUp}
								>
									<Button
										size="lg"
										className="h-14 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 text-base font-bold shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:scale-105"
										onClick={() =>
											navigate({ to: "/predict" })
										}
									>
										Start Prediction{" "}
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>

									<Button
										variant="outline"
										size="lg"
										onClick={() =>
											navigate({ to: "/about" })
										}
										className="h-14 rounded-full border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white px-8 text-base font-medium transition-all"
									>
										View Methodology
									</Button>
								</motion.div>
							</motion.div>

							{/* Right Image (Glassmorphism Card) */}
							<motion.div
								className="relative w-full flex justify-center lg:justify-end"
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: 0.2 }}
							>
								<motion.div
									className="w-full max-w-[600px] relative rounded-3xl overflow-hidden border border-slate-700/50 bg-slate-800/50 backdrop-blur-md shadow-2xl shadow-black/50 p-2 group"
									variants={float}
									animate="animate"
								>
									{/* Inner glowing border container */}
									<div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

									<div className="relative rounded-2xl overflow-hidden bg-[#0B1221] aspect-[4/3] group-hover:scale-[1.01] transition-transform duration-700">
										{/* Placeholder logic for image if variable is missing in preview */}
										<img
											src={hero_image}
											className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
											alt="AI Health Analysis Dashboard"
										/>

										{/* Overlay gradient for depth */}
										<div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-transparent to-transparent opacity-80" />
									</div>

									{/* Floating UI Elements (Decoration) */}
									<div className="absolute top-8 right-8 p-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl animate-bounce duration-[3000ms]">
										<BrainCircuit className="h-8 w-8 text-teal-400" />
									</div>

									<div className="absolute bottom-8 left-8 px-5 py-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl flex items-center gap-4">
										<div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
										<div>
											<p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
												System Status
											</p>
											<p className="text-sm font-bold text-white">
												Models Online
											</p>
										</div>
									</div>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* --- Features Section (Light Theme) --- */}
				<section className="bg-slate-50 py-24 relative z-10">
					<div className="container mx-auto px-4 md:px-12 lg:px-24">
						<motion.div
							className="text-center max-w-3xl mx-auto mb-16"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={fadeInUp}
						>
							<h2 className="text-sm font-bold text-teal-600 tracking-widest uppercase mb-3">
								Core Capabilities
							</h2>
							<h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
								Why Use BioMetric?
							</h2>
							<p className="text-slate-600 text-lg leading-relaxed">
								Our system leverages advanced machine learning
								to provide accurate,
								<span className="font-semibold text-slate-900">
									{" "}
									data-driven{" "}
								</span>
								health risk and academic forecasting tailored
								for the student body.
							</p>
						</motion.div>

						<div className="grid md:grid-cols-3 gap-8">
							<FeatureCard
								icon={
									<BarChart3 className="h-8 w-8 text-blue-600" />
								}
								title="AI Benchmarking"
								description="We compare results across multiple predictive models (Random Forest, Neural Networks) to ensure highest accuracy."
								delay={0}
							/>
							<FeatureCard
								icon={
									<ShieldCheck className="h-8 w-8 text-teal-600" />
								}
								title="Secure Data"
								description="Your health and academic data is strictly anonymized and protected according to university data privacy standards."
								delay={0.1}
							/>
							<FeatureCard
								icon={
									<Zap className="h-8 w-8 text-amber-500" />
								}
								title="Instant Results"
								description="Receive a comprehensive risk and performance profile in seconds. Get actionable insights immediately."
								delay={0.2}
							/>
						</div>
					</div>
				</section>

				{/* --- Workflow Section --- */}
				<section className="py-24 bg-white relative overflow-hidden">
					{/* Background Grid for technical feel */}
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px]" />

					<div className="container mx-auto px-4 text-center relative z-10">
						<motion.h2
							className="text-3xl font-bold text-slate-900 mb-16"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							How It Works
						</motion.h2>

						<motion.div
							className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8 md:gap-0 relative max-w-5xl mx-auto"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={staggerContainer}
						>
							{/* Connector Line (Desktop) */}
							<div className="hidden md:block absolute top-[48px] left-[10%] right-[10%] h-1 bg-slate-100 z-0">
								<motion.div
									className="h-full bg-gradient-to-r from-teal-500 to-blue-500 origin-left"
									initial={{ scaleX: 0 }}
									whileInView={{ scaleX: 1 }}
									transition={{ duration: 1.5, delay: 0.5 }}
								/>
							</div>

							{/* Step 1 */}
							<WorkflowStep
								icon={
									<FileText className="h-10 w-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
								}
								title="1. Input Data"
								description="Enter basic health metrics"
							/>

							{/* Step 2 (Highlighted) */}
							<WorkflowStep
								icon={
									<BrainCircuit className="h-12 w-12 text-white" />
								}
								title="2. AI Analysis"
								description="Neural Engine Processing"
								isMain={true}
							/>

							{/* Step 3 */}
							<WorkflowStep
								icon={
									<ClipboardList className="h-10 w-10 text-slate-400 group-hover:text-teal-500 transition-colors" />
								}
								title="3. Get Profile"
								description="View Risk Assessment"
							/>
						</motion.div>

						<div className="mt-16">
							<Button
								size="lg"
								className="rounded-full px-10 h-12 bg-slate-900 text-white hover:bg-slate-800"
								onClick={() => navigate({ to: "/predict" })}
							>
								Try It Now
							</Button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

// --- Sub-components ---

function FeatureCard({
	icon,
	title,
	description,
	delay,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
}) {
	return (
		<motion.div
			className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 group"
			variants={fadeInUp}
		>
			<div className="p-4 bg-slate-50 rounded-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
				{icon}
			</div>
			<h3 className="text-xl font-bold text-slate-900">{title}</h3>
			<p className="text-slate-500 leading-relaxed text-sm">
				{description}
			</p>
		</motion.div>
	);
}

function WorkflowStep({
	icon,
	title,
	description,
	isMain = false,
}: {
	icon: any;
	title: string;
	description: string;
	isMain?: boolean;
}) {
	return (
		<div className="flex-1 flex flex-col items-center gap-4 z-10 min-w-[200px]">
			<motion.div
				variants={scaleIn}
				className={`
                    flex items-center justify-center shadow-lg transition-all duration-300 group
                    ${
						isMain
							? "h-28 w-28 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 shadow-teal-500/30"
							: "h-24 w-24 rounded-full bg-white border-2 border-slate-100 hover:border-teal-400"
					}
                `}
			>
				{icon}
				{isMain && (
					<div className="absolute inset-0 rounded-full ring-4 ring-white/20 animate-pulse" />
				)}
			</motion.div>
			<div className="text-center">
				<h3
					className={`font-bold text-lg ${isMain ? "text-teal-600" : "text-slate-800"}`}
				>
					{title}
				</h3>
				<p className="text-sm text-slate-500">{description}</p>
			</div>
		</div>
	);
}
