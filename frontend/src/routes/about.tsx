import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { aboutObjectives } from "@/static_data/about_objectives";
import { LocalBenchmarks } from "@/static_data/local_benchmarks";
import {
	ModelBenchmarks,
	type BenchmarkEntry,
} from "@/static_data/model_benchmarks";
import { createFileRoute } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import {
	Activity,
	ArrowRight,
	BrainCircuit,
	CheckCircle2,
	Cpu,
	Database,
	GitBranch,
	HeartPulse,
	Layout,
	Microscope,
	Server,
	Stethoscope,
	Target,
	Trophy,
} from "lucide-react";
import { useEffect } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
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

const highlightedModelName = "Logistic Regression";

const referenceBenchmarkPalette: Record<string, string> = {
	[highlightedModelName]: "#14b8a6",
	SVM: "#60a5fa",
	"Random Forest": "#94a3b8",
};

const localBenchmarkPalette: Record<string, string> = {
	"Logistic Regression": "#10b981",
	SVM: "#0ea5e9",
	"Random Forest": "#f59e0b",
};

const localBenchmarkMap = new Map(
	LocalBenchmarks.map((entry) => [entry.algorithm, entry]),
);

type MetricKey = keyof Pick<
	BenchmarkEntry,
	"accuracy" | "precision" | "recall" | "f1_score"
>;

type ComparableBenchmarkEntry = Pick<
	BenchmarkEntry,
	"accuracy" | "precision" | "recall" | "f1_score" | "confusion_matrix"
>;

const referenceWinners = getBestAlgorithms(ModelBenchmarks, "f1_score");
const localWinners = getBestAlgorithms(LocalBenchmarks, "f1_score");
const logisticReferenceBenchmark =
	ModelBenchmarks.find((entry) => entry.algorithm === highlightedModelName) ??
	null;
const logisticLocalBenchmark =
	LocalBenchmarks.find((entry) => entry.algorithm === highlightedModelName) ??
	null;
const logisticWinsBothDatasets =
	referenceWinners.includes(highlightedModelName) &&
	localWinners.includes(highlightedModelName);

function formatBenchmarkValue(value?: number | null) {
	if (value == null || Number.isNaN(value)) {
		return "--";
	}

	return `${value.toFixed(1)}%`;
}

function joinLabels(labels: string[]) {
	if (labels.length <= 1) {
		return labels[0] ?? "--";
	}

	if (labels.length === 2) {
		return `${labels[0]} and ${labels[1]}`;
	}

	const leadingLabels = labels.slice(0, -1).join(", ");
	return `${leadingLabels}, and ${labels[labels.length - 1]}`;
}

function getBestAlgorithms(entries: BenchmarkEntry[], key: MetricKey) {
	const maxValue = Math.max(...entries.map((entry) => entry[key]));

	return entries
		.filter((entry) => entry[key] === maxValue)
		.map((entry) => entry.algorithm);
}

function getMatrixValue(
	entry: ComparableBenchmarkEntry | null | undefined,
	row: number,
	column: number,
) {
	return entry?.confusion_matrix[row]?.[column] ?? 0;
}

function AboutBenchmarkPanel({
	title,
	caption,
	entry,
	accentColor,
	panelClassName,
}: {
	title: string;
	caption: string;
	entry: ComparableBenchmarkEntry | null;
	accentColor: string;
	panelClassName: string;
}) {
	return (
		<div className={panelClassName}>
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
						{title}
					</p>
					<p className="mt-2 text-sm text-slate-500">{caption}</p>
				</div>
				<div
					className="rounded-full px-2.5 py-1 text-[11px] font-bold"
					style={{
						backgroundColor: `${accentColor}14`,
						color: accentColor,
					}}
				>
					{formatBenchmarkValue(entry?.f1_score)} F1
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-2 text-center">
				{[
					{ label: "Accuracy", value: entry?.accuracy },
					{ label: "Precision", value: entry?.precision },
					{ label: "Recall", value: entry?.recall },
					{ label: "F1 Score", value: entry?.f1_score },
				].map((metric) => (
					<div
						key={`${title}-${metric.label}`}
						className="rounded-2xl border border-white/80 bg-white/90 px-3 py-3"
					>
						<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
							{metric.label}
						</div>
						<div className="mt-2 text-sm font-bold text-slate-900">
							{formatBenchmarkValue(metric.value)}
						</div>
					</div>
				))}
			</div>

			<div className="mt-4 border-t border-slate-200/80 pt-4">
				<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">
					Confusion Matrix
				</p>
				<div className="mt-3 grid grid-cols-2 gap-2 text-center font-mono text-xs">
					<div className="rounded-2xl bg-emerald-50 px-3 py-4 text-emerald-700">
						<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500">
							TN
						</div>
						<div className="mt-2 text-lg font-bold">
							{getMatrixValue(entry, 0, 0)}
						</div>
					</div>
					<div className="rounded-2xl bg-rose-50 px-3 py-4 text-rose-700">
						<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-500">
							FP
						</div>
						<div className="mt-2 text-lg font-bold">
							{getMatrixValue(entry, 0, 1)}
						</div>
					</div>
					<div className="rounded-2xl bg-rose-50 px-3 py-4 text-rose-700">
						<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-500">
							FN
						</div>
						<div className="mt-2 text-lg font-bold">
							{getMatrixValue(entry, 1, 0)}
						</div>
					</div>
					<div className="rounded-2xl bg-emerald-50 px-3 py-4 text-emerald-700">
						<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500">
							TP
						</div>
						<div className="mt-2 text-lg font-bold">
							{getMatrixValue(entry, 1, 1)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function RouteComponent() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<div className="min-h-screen bg-slate-50 font-sans pb-20 overflow-x-hidden">
			{/* --- Background Section --- */}
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

						<div className="inline-flex max-w-3xl items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-left text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-950/20">
							<Trophy className="h-4 w-4 shrink-0 text-emerald-300" />
							<span>
								Logistic Regression is presented as the winning
								model on both the Kaggle benchmark and the local
								evaluation set.
							</span>
						</div>
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
					{/* --- System Objectives --- */}
					<motion.div
						variants={fadeInUp}
						initial="initial"
						animate="animate"
					>
						<Card className="group border border-slate-700/50 bg-slate-800/80 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden relative">
							<div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 via-teal-500 to-blue-600" />

							<CardHeader className="p-8 pb-4">
								<CardTitle className="flex items-center gap-3 text-2xl text-white font-bold tracking-tight">
									<div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
										<CheckCircle2 className="h-6 w-6 text-teal-400" />
									</div>
									Research Objectives
								</CardTitle>
							</CardHeader>

							<CardContent className="p-8 pt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
								{aboutObjectives.map((obj) => (
									<div
										key={obj.id}
										className="group/item flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-700/40 border border-white/5 hover:border-teal-500/30 transition-all duration-300"
									>
										<div className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)] group-hover/item:shadow-[0_0_12px_rgba(45,212,191,1)] group-hover/item:scale-125 transition-transform" />

										<p className="text-sm text-slate-300 font-medium leading-relaxed">
											{obj.text.split(obj.highlight)
												.length > 1 ? (
												<>
													{
														obj.text.split(
															obj.highlight,
														)[0]
													}
													<span className="text-teal-200 font-bold">
														{obj.highlight}
													</span>
													{
														obj.text.split(
															obj.highlight,
														)[1]
													}
												</>
											) : (
												obj.text
											)}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					</motion.div>

					{/* --- Architecture --- */}
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
											Interactive dashboard for users to
											input parameters and visualize risk
											probabilities.
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

							{/* Backend */}
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
											NestJS manages user input data,
											validate data, and orchestrates
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

						<Card className="overflow-hidden rounded-[2rem] border-none bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-2xl shadow-emerald-200/60">
							<CardContent className="p-8 md:p-10">
								<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
									<div className="max-w-3xl">
										<div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/90">
											<Trophy className="h-3.5 w-3.5" />
											Overall winner
										</div>
										<h3 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
											{logisticWinsBothDatasets
												? "Logistic Regression ranks first on both the Kaggle and local datasets."
												: `${joinLabels(referenceWinners)} leads the Kaggle set while ${joinLabels(localWinners)} leads the local set.`}
										</h3>
										<p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
											The page now centers Logistic
											Regression as the winning model,
											with an F1 score of{" "}
											{formatBenchmarkValue(
												logisticReferenceBenchmark?.f1_score,
											)}{" "}
											on the Kaggle benchmark and{" "}
											{formatBenchmarkValue(
												logisticLocalBenchmark?.f1_score,
											)}{" "}
											on the local dataset.
										</p>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-[1.5rem] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
											<p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
												Kaggle F1
											</p>
											<p className="mt-2 text-2xl font-black">
												{formatBenchmarkValue(
													logisticReferenceBenchmark?.f1_score,
												)}
											</p>
										</div>
										<div className="rounded-[1.5rem] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
											<p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
												Local F1
											</p>
											<p className="mt-2 text-2xl font-black">
												{formatBenchmarkValue(
													logisticLocalBenchmark?.f1_score,
												)}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="space-y-6">
							<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
								<CardHeader className="p-8 pb-2">
									<CardTitle className="text-xl font-bold text-slate-900">
										Accuracy Comparison
									</CardTitle>
									<CardDescription className="text-slate-500">
										Kaggle benchmark accuracy, with Logistic
										Regression highlighted as the strongest
										model alongside the local evaluation
										results.
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
																	referenceBenchmarkPalette[
																		entry
																			.algorithm
																	] ??
																	"#64748b"
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

							<div className="space-y-4">
								{ModelBenchmarks.map((model, index) => {
									const localModel =
										localBenchmarkMap.get(
											model.algorithm,
										) ?? null;
									const referenceColor =
										referenceBenchmarkPalette[
											model.algorithm
										] ?? "#64748b";
									const isWinner =
										model.algorithm ===
										highlightedModelName;
									const f1Gap =
										localModel == null
											? null
											: model.f1_score -
												localModel.f1_score;

									return (
										<Card
											key={index}
											className={`border shadow-lg rounded-3xl bg-white overflow-hidden group transition-transform duration-300 hover:scale-[1.02] ${
												isWinner
													? "border-emerald-300 shadow-emerald-200/70"
													: "border-slate-200 shadow-slate-200/50"
											}`}
										>
											<div
												className="h-1.5 w-full"
												style={{
													backgroundColor:
														referenceColor,
												}}
											/>
											<CardHeader className="p-6 pb-2">
												<CardTitle className="flex items-center justify-between gap-3 text-base font-bold text-slate-900">
													{model.algorithm}
													<span
														className="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono font-bold"
														style={{
															color: referenceColor,
														}}
													>
														{isWinner
															? "Winner on Kaggle + local"
															: f1Gap == null
																? "No local match"
																: `${f1Gap > 0 ? "+" : ""}${f1Gap.toFixed(1)} F1 gap`}
													</span>
												</CardTitle>
											</CardHeader>
											<CardContent className="p-6 pt-2">
												<div className="grid gap-4 md:grid-cols-2">
													<AboutBenchmarkPanel
														title="Reference Benchmark"
														caption={
															isWinner
																? "Kaggle benchmark winner and selected production model."
																: "Published Kaggle benchmark values used as the baseline."
														}
														entry={model}
														accentColor={
															referenceColor
														}
														panelClassName="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4"
													/>
													<AboutBenchmarkPanel
														title="Local Evaluation"
														caption={
															isWinner
																? "Top performer on the local survey dataset as well."
																: "Measured on the local survey dataset for presentation comparison."
														}
														entry={localModel}
														accentColor={
															localBenchmarkPalette[
																model.algorithm
															] ?? referenceColor
														}
														panelClassName="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-4"
													/>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						</div>
					</motion.div>

					{/* --- Workflow Pipeline Visual --- */}
					<motion.div
						variants={fadeInUp}
						className="rounded-[2.5rem] border border-slate-800 bg-[#0F172A] p-8 md:p-12 shadow-2xl relative overflow-hidden group"
					>
						<div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
						<div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]" />
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

						<h3 className="text-xl font-bold flex items-center justify-center gap-2 text-white mb-10 relative z-10">
							<Cpu className="h-6 w-6 text-teal-400" />
							Data Flow Pipeline
						</h3>

						<div className="relative z-10 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
							<div className="flex flex-col items-center gap-4 group/step">
								<div className="h-20 w-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-xl transition-transform group-hover/step:scale-110 group-hover/step:border-blue-500/50">
									<Layout className="h-8 w-8" />
								</div>
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Input
								</span>
							</div>

							<ArrowRight className="hidden h-6 w-6 text-slate-600 md:block" />
							<ArrowRight className="h-6 w-6 rotate-90 text-slate-600 md:hidden" />

							<div className="flex flex-col items-center gap-4 group/step">
								<div className="h-20 w-20 rounded-2xl bg-slate-800 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] transition-transform group-hover/step:scale-110 group-hover/step:border-indigo-500/60">
									<Server className="h-8 w-8" />
								</div>
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Processing
								</span>
							</div>

							<ArrowRight className="hidden h-6 w-6 text-slate-600 md:block" />
							<ArrowRight className="h-6 w-6 rotate-90 text-slate-600 md:hidden" />

							<div className="flex flex-col items-center gap-4 group/step">
								<div className="h-20 w-20 rounded-2xl bg-slate-800 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_20px_-5px_rgba(45,212,191,0.2)] transition-transform group-hover/step:scale-110 group-hover/step:border-teal-500/60">
									<BrainCircuit className="h-8 w-8" />
								</div>
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Inference
								</span>
							</div>

							<ArrowRight className="hidden h-6 w-6 text-slate-600 md:block" />
							<ArrowRight className="h-6 w-6 rotate-90 text-slate-600 md:hidden" />

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
