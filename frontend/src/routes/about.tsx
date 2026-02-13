import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Activity,
	Server,
	Layout,
	BrainCircuit,
	GitBranch,
	CheckCircle2,
	Stethoscope,
	Microscope,
	HeartPulse,
	ArrowRight,
	Target,
	Database,
	Cpu,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";

// --- YOUR DATA (Themed) ---
// Updated colors to match the Teal/Blue/Indigo theme
export const ModelBenchmarks = [
	{
		algorithm: "Logistic Regression",
		accuracy: 93.3,
		precision: 93.4,
		recall: 93.3,
		f1_score: 93.3,
		status: "Ready",
		color: "#818cf8", // Indigo (was Blue)
	},
	{
		algorithm: "SVM",
		accuracy: 96.0,
		precision: 96.0,
		recall: 96.0,
		f1_score: 96.0,
		status: "Ready",
		color: "#60a5fa", // Blue (was Violet)
	},
	{
		algorithm: "Random Forest",
		accuracy: 96.0,
		precision: 96.0,
		recall: 96.0,
		f1_score: 96.0,
		status: "Ready",
		color: "#2dd4bf", // Teal (was Emerald)
	},
];

export const Route = createFileRoute("/about")({
	component: RouteComponent,
});

// --- Animation Variants (Copied from Theme) ---
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

function RouteComponent() {
	return (
		<div className="min-h-screen bg-slate-50 font-sans pb-20 overflow-x-hidden">
			{/* --- Background Section (Matches Previous Theme) --- */}
			<div className="relative pt-12 pb-32 md:pt-16 md:pb-48 bg-[#0F172A] overflow-hidden">
				{/* Background Gradients */}
				<div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute bottom-[0%] right-[-5%] w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

				<motion.div
					className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10"
					variants={staggerContainer}
					initial="hidden"
					animate="visible"
				>
					{/* --- Header Section --- */}
					<motion.div
						variants={fadeInUp}
						className="text-center space-y-6 max-w-4xl mx-auto"
					>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest mb-4">
							<Target className="h-3 w-3" /> Thesis Project 2026
						</div>

						<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
							Health Risk <br className="md:hidden" />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
								Prediction System
							</span>
						</h1>

						<p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
							An advanced diagnostic support tool utilizing
							supervised machine learning to forecast potential
							health anomalies based on clinical data.
						</p>
					</motion.div>
				</motion.div>
			</div>

			{/* --- Main Content --- */}
			<div className="container mx-auto px-6 md:px-12 lg:px-24 -mt-32 relative z-20">
				<motion.div
					variants={staggerContainer}
					initial="hidden"
					animate="visible"
					className="space-y-12"
				>
					{/* --- System Objectives (Glass Card) --- */}
					<motion.div variants={fadeInUp}>
						<Card className="border border-slate-700/50 bg-slate-800/80 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden relative">
							<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-blue-500" />
							<CardHeader className="p-8 pb-4">
								<CardTitle className="flex items-center gap-3 text-2xl text-white">
									<CheckCircle2 className="h-6 w-6 text-teal-500" />
									Research Objectives
								</CardTitle>
							</CardHeader>
							<CardContent className="p-8 pt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{[
									"Early detection of potential health risks",
									"Comparative analysis of ML algorithms (LR, SVM, RF)",
									"Minimize false negatives in diagnostics",
									"Provide explainable metrics for providers",
									"Seamless Python to Node.js integration",
									"Real-time inference capability",
								].map((obj, i) => (
									<div
										key={i}
										className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
									>
										<div className="h-1.5 w-1.5 mt-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] shrink-0" />
										<span className="text-sm text-slate-300 font-medium leading-relaxed">
											{obj}
										</span>
									</div>
								))}
							</CardContent>
						</Card>
					</motion.div>

					{/* --- Architecture & Tech Stack --- */}
					<div className="space-y-8">
						<motion.div
							variants={fadeInUp}
							className="flex items-center gap-4"
						>
							<div className="h-px flex-1 bg-slate-200" />
							<h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
								<GitBranch className="h-6 w-6 text-blue-500" />
								System Architecture
							</h2>
							<div className="h-px flex-1 bg-slate-200" />
						</motion.div>

						<div className="grid md:grid-cols-3 gap-6">
							{/* Frontend */}
							<motion.div variants={fadeInUp} className="h-full">
								<Card className="h-full border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white transition-all duration-300 hover:scale-[1.02]">
									<CardHeader className="p-8 pb-4">
										<CardTitle className="flex items-center gap-3 text-lg text-slate-900">
											<div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
												<Layout className="h-5 w-5" />
											</div>
											Presentation Layer
										</CardTitle>
										<CardDescription className="text-slate-500 ml-14">
											Client Interface
										</CardDescription>
									</CardHeader>
									<CardContent className="p-8 pt-2 space-y-6">
										<p className="text-sm text-slate-600 leading-relaxed font-medium">
											Interactive dashboard for doctors to
											input patient parameters and
											visualize risk probabilities.
										</p>
										<div className="flex flex-wrap gap-2">
											{[
												"React Vite",
												"Tailwind",
												"Recharts",
											].map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg"
												>
													{tag}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>

							{/* Backend - Swapped Red for Indigo to fit theme */}
							<motion.div variants={fadeInUp} className="h-full">
								<Card className="h-full border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white transition-all duration-300 hover:scale-[1.02]">
									<CardHeader className="p-8 pb-4">
										<CardTitle className="flex items-center gap-3 text-lg text-slate-900">
											<div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
												<Server className="h-5 w-5" />
											</div>
											Orchestration Layer
										</CardTitle>
										<CardDescription className="text-slate-500 ml-14">
											API Gateway
										</CardDescription>
									</CardHeader>
									<CardContent className="p-8 pt-2 space-y-6">
										<p className="text-sm text-slate-600 leading-relaxed font-medium">
											NestJS manages user authentication,
											patient records, and orchestrates
											requests to the prediction engine.
										</p>
										<div className="flex flex-wrap gap-2">
											{[
												"NestJS",
												"TypeScript",
												"TypeORM",
											].map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-lg"
												>
													{tag}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>

							{/* Prediction */}
							<motion.div variants={fadeInUp} className="h-full">
								<Card className="h-full border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white transition-all duration-300 hover:scale-[1.02]">
									<CardHeader className="p-8 pb-4">
										<CardTitle className="flex items-center gap-3 text-lg text-slate-900">
											<div className="p-3 rounded-2xl bg-teal-500/10 text-teal-500">
												<BrainCircuit className="h-5 w-5" />
											</div>
											Intelligence Engine
										</CardTitle>
										<CardDescription className="text-slate-500 ml-14">
											ML Microservice
										</CardDescription>
									</CardHeader>
									<CardContent className="p-8 pt-2 space-y-6">
										<p className="text-sm text-slate-600 leading-relaxed font-medium">
											FastAPI + Python service dedicated
											to loading trained models and
											performing real-time inference.
										</p>
										<div className="flex flex-wrap gap-2">
											{[
												"FastAPI",
												"Scikit-learn",
												"Pandas",
											].map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 px-3 py-1 rounded-lg"
												>
													{tag}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>

					{/* --- Model Performance Visualization --- */}
					<motion.div variants={fadeInUp} className="space-y-8">
						<div className="flex items-center gap-4">
							<div className="h-px flex-1 bg-slate-200" />
							<h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
								<Activity className="h-6 w-6 text-violet-500" />
								Performance Evaluation
							</h2>
							<div className="h-px flex-1 bg-slate-200" />
						</div>

						<div className="grid lg:grid-cols-3 gap-8">
							{/* Chart Section */}
							<Card className="lg:col-span-2 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
								<CardHeader className="p-8 pb-2">
									<CardTitle className="text-xl font-bold text-slate-900">
										Accuracy Comparison
									</CardTitle>
									<CardDescription className="text-slate-500">
										Testing results on validation dataset
										(Top 3 Algorithms)
									</CardDescription>
								</CardHeader>
								<CardContent className="p-8">
									<div className="h-[350px] w-full">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
											<BarChart
												data={ModelBenchmarks}
												layout="vertical"
												margin={{
													top: 0,
													right: 30,
													left: 0,
													bottom: 0,
												}}
												barGap={2}
											>
												<CartesianGrid
													strokeDasharray="3 3"
													horizontal={false}
													stroke="#f1f5f9"
												/>
												<XAxis
													type="number"
													domain={[80, 100]}
													hide
												/>
												<YAxis
													dataKey="algorithm"
													type="category"
													width={140}
													tick={{
														fill: "#64748b",
														fontSize: 13,
														fontWeight: 600,
													}}
													axisLine={false}
													tickLine={false}
												/>
												<Tooltip
													cursor={{
														fill: "#f8fafc",
														radius: 8,
													}}
													contentStyle={{
														borderRadius: "16px",
														border: "none",
														boxShadow:
															"0 10px 15px -3px rgb(0 0 0 / 0.1)",
														padding: "16px",
														fontFamily:
															"sans-serif",
													}}
												/>
												<Bar
													dataKey="accuracy"
													radius={[0, 6, 6, 0]}
													barSize={32}
													animationDuration={1500}
												>
													{ModelBenchmarks.map(
														(entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	entry.color
																}
															/>
														),
													)}
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>

							{/* Detailed Metrics List */}
							<div className="space-y-4">
								{ModelBenchmarks.map((model, i) => (
									<Card
										key={i}
										className="border border-slate-200 shadow-lg shadow-slate-200/50 rounded-3xl bg-white overflow-hidden group"
									>
										<div
											className="h-1.5 w-full"
											style={{
												backgroundColor: model.color,
											}}
										/>
										<CardHeader className="p-6 pb-2">
											<CardTitle className="text-base font-bold flex justify-between items-center text-slate-900">
												{model.algorithm}
												<span
													className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded-md"
													style={{
														color: model.color,
													}}
												>
													{model.accuracy}% Acc
												</span>
											</CardTitle>
										</CardHeader>
										<CardContent className="p-6 pt-2 grid grid-cols-3 gap-2 text-center">
											<div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
												<div className="font-bold text-slate-700 text-sm">
													{model.precision}%
												</div>
												<div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">
													Prec
												</div>
											</div>
											<div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
												<div className="font-bold text-slate-700 text-sm">
													{model.recall}%
												</div>
												<div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">
													Recall
												</div>
											</div>
											<div
												className="p-2 rounded-xl border"
												style={{
													backgroundColor: `${model.color}10`, // 10% opacity
													borderColor: `${model.color}30`,
												}}
											>
												<div
													className="font-bold text-sm"
													style={{
														color: model.color,
													}}
												>
													{model.f1_score}%
												</div>
												<div
													className="text-[10px] uppercase tracking-wider font-bold mt-1 opacity-70"
													style={{
														color: model.color,
													}}
												>
													F1
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</motion.div>

					{/* --- Workflow Pipeline Visual --- */}
					<motion.div
						variants={fadeInUp}
						className="rounded-[2.5rem] border border-slate-800 bg-[#0F172A] p-8 md:p-12 shadow-2xl relative overflow-hidden group"
					>
						{/* Background Grid inside pipeline */}
						<div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />

						<div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]" />
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

						<h3 className="text-xl font-bold flex items-center justify-center gap-2 text-white mb-10 relative z-10">
							<Cpu className="h-6 w-6 text-teal-400" />
							Data Flow Pipeline
						</h3>

						<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 relative z-10">
							{/* Step 1 */}
							<div className="flex flex-col items-center gap-4 group/step">
								<div className="h-20 w-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-xl transition-transform group-hover/step:scale-110 group-hover/step:border-blue-500/50">
									<Layout className="h-8 w-8" />
								</div>
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Input
								</span>
							</div>

							{/* Arrow */}
							<ArrowRight className="text-slate-600 h-6 w-6 hidden md:block" />
							<ArrowRight className="text-slate-600 h-6 w-6 md:hidden rotate-90" />

							{/* Step 2 */}
							<div className="flex flex-col items-center gap-4 group/step">
								<div className="h-20 w-20 rounded-2xl bg-slate-800 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] transition-transform group-hover/step:scale-110 group-hover/step:border-indigo-500/60">
									<Server className="h-8 w-8" />
								</div>
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Processing
								</span>
							</div>

							{/* Arrow */}
							<ArrowRight className="text-slate-600 h-6 w-6 hidden md:block" />
							<ArrowRight className="text-slate-600 h-6 w-6 md:hidden rotate-90" />

							{/* Step 3 */}
							<div className="flex flex-col items-center gap-4 group/step">
								<div className="h-20 w-20 rounded-2xl bg-slate-800 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_20px_-5px_rgba(45,212,191,0.2)] transition-transform group-hover/step:scale-110 group-hover/step:border-teal-500/60">
									<BrainCircuit className="h-8 w-8" />
								</div>
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Inference
								</span>
							</div>

							{/* Arrow */}
							<ArrowRight className="text-slate-600 h-6 w-6 hidden md:block" />
							<ArrowRight className="text-slate-600 h-6 w-6 md:hidden rotate-90" />

							{/* Step 4 */}
							<div className="flex flex-col items-center gap-4 group/step">
								<div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 border border-teal-400/50 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transition-transform group-hover/step:scale-110">
									<Database className="h-8 w-8" />
								</div>
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Result
								</span>
							</div>
						</div>
					</motion.div>

					{/* --- Stakeholder Benefits --- */}
					<motion.div variants={fadeInUp}>
						<div className="grid gap-6 md:grid-cols-3">
							<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white transition-all hover:-translate-y-1">
								<CardHeader>
									<div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
										<Stethoscope className="h-6 w-6 text-rose-500" />
									</div>
									<CardTitle className="text-slate-900">
										For Clinicians
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600 leading-relaxed font-medium">
										Acts as a second opinion tool to
										validate diagnoses and identify subtle
										patterns in patient data that may be
										overlooked.
									</p>
								</CardContent>
							</Card>

							<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white transition-all hover:-translate-y-1">
								<CardHeader>
									<div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4">
										<HeartPulse className="h-6 w-6 text-teal-500" />
									</div>
									<CardTitle className="text-slate-900">
										For Patients
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600 leading-relaxed font-medium">
										Enables earlier intervention and
										personalized preventative care plans
										based on calculated risk profiles.
									</p>
								</CardContent>
							</Card>

							<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white transition-all hover:-translate-y-1">
								<CardHeader>
									<div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
										<Microscope className="h-6 w-6 text-blue-500" />
									</div>
									<CardTitle className="text-slate-900">
										For Researchers
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600 leading-relaxed font-medium">
										Provides a standardized benchmark for
										testing various supervised learning
										models on local health datasets.
									</p>
								</CardContent>
							</Card>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
