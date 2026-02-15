import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import {
	motion,
	useInView,
	useMotionValue,
	useSpring,
	type Variants,
} from "framer-motion";
import {
	Activity,
	ArrowRight,
	BrainCircuit,
	CheckCircle2,
	Download,
	Grid2X2,
	RefreshCw,
	Sigma,
	Trees,
	Trophy,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

// --- Local Data Definition ---
const ModelBenchmarks = [
	{
		algorithm: "Logistic Regression",
		accuracy: 93.3,
		precision: 93.4,
		recall: 93.3,
		f1_score: 93.3,
		status: "Ready",
		confusion_matrix: [
			[40, 3],
			[2, 30],
		],
	},
	{
		algorithm: "SVM",
		accuracy: 96.0,
		precision: 96.0,
		recall: 96.0,
		f1_score: 96.0,
		status: "Ready",
		confusion_matrix: [
			[42, 1],
			[2, 30],
		],
	},
	{
		algorithm: "Random Forest",
		accuracy: 96.0,
		precision: 96.0,
		recall: 96.0,
		f1_score: 96.0,
		status: "Ready",
		confusion_matrix: [
			[42, 1],
			[2, 30],
		],
	},
];

export const Route = createFileRoute("/model-benchmarking")({
	component: ModelBenchmarking,
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

// --- Helper: Animated Number ---
function Counter({ value }: { value: number }) {
	const ref = useRef<HTMLSpanElement>(null);
	const motionValue = useMotionValue(0);
	const springValue = useSpring(motionValue, {
		damping: 30,
		stiffness: 100,
	});
	const isInView = useInView(ref, { once: true, margin: "-10px" });

	useEffect(() => {
		if (isInView) {
			motionValue.set(value);
		}
	}, [motionValue, value, isInView]);

	useEffect(() => {
		springValue.on("change", (latest) => {
			if (ref.current) {
				ref.current.textContent = latest.toFixed(1);
			}
		});
	}, [springValue]);

	return <span ref={ref} />;
}

// --- Helper: Confusion Matrix Component ---
const ConfusionMatrixViz = ({
	matrix,
	color,
}: {
	matrix: number[][];
	color: string;
}) => {
	const flat = matrix.flat();
	const maxVal = Math.max(...flat);

	const cells = [
		{ label: "TP", val: matrix[0][0], type: "True Pos" },
		{ label: "FP", val: matrix[0][1], type: "False Pos" },
		{ label: "FN", val: matrix[1][0], type: "False Neg" },
		{ label: "TN", val: matrix[1][1], type: "True Neg" },
	];

	return (
		<div className="flex flex-col items-center p-2">
			<div className="flex gap-2">
				{/* Y-Axis Label: Using vertical writing mode for better alignment */}
				<div className="flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
					Actual Class
				</div>

				<div className="flex flex-col gap-2">
					{/* X-Axis Label */}
					<div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
						Predicted Class
					</div>

					{/* Matrix Grid */}
					<div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
						{cells.map((cell, i) => {
							const intensity = cell.val / maxVal;
							// Diagonal (TP/TN) get main color, Errors (FP/FN) get Red
							const isDiagonal = i === 0 || i === 3;
							const cellColor = isDiagonal ? color : "#ef4444";

							return (
								<div
									key={i}
									className="h-14 w-16 rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-all hover:scale-105"
									style={{
										backgroundColor: isDiagonal
											? `${color}15`
											: "#ef444410",
									}}
								>
									{/* Heatmap background opacity */}
									<div
										className="absolute inset-0"
										style={{
											backgroundColor: cellColor,
											opacity: 0.1 + intensity * 0.4,
										}}
									/>

									<span className="text-lg font-bold text-slate-700 relative z-10">
										{cell.val}
									</span>
									<span className="text-[9px] font-medium text-slate-500 uppercase relative z-10 opacity-70">
										{cell.label}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

function ModelBenchmarking() {
	const { processedData, chartData, bestModels, maxScore } = useMemo(() => {
		const maxScore = Math.max(...ModelBenchmarks.map((m) => m.f1_score));

		const processed = ModelBenchmarks.map((item) => {
			let uiProps = {
				color: "#94a3b8", // Default Slate
				bg: "bg-slate-500/10",
				border: "border-slate-500/20",
				icon: BrainCircuit,
				desc: "Standard classification model",
			};

			if (item.algorithm.includes("Random Forest")) {
				uiProps = {
					color: "#2dd4bf", // Teal
					bg: "bg-teal-500/10",
					border: "border-teal-500/20",
					icon: Trees,
					desc: "Ensemble learning method",
				};
			} else if (item.algorithm.includes("SVM")) {
				uiProps = {
					color: "#60a5fa", // Blue
					bg: "bg-blue-500/10",
					border: "border-blue-500/20",
					icon: Activity,
					desc: "Hyperplane classification",
				};
			} else if (item.algorithm.includes("Logistic Regression")) {
				uiProps = {
					color: "#818cf8", // Indigo
					bg: "bg-indigo-500/10",
					border: "border-indigo-500/20",
					icon: Sigma,
					desc: "Probabilistic statistical model",
				};
			}

			return {
				...item,
				...uiProps,
				isBest: item.f1_score === maxScore,
			};
		});

		const charts = [
			{ name: "Accuracy" },
			{ name: "Precision" },
			{ name: "Recall" },
			{ name: "F1 Score" },
		].map((metric) => {
			// Type safe accumulator
			const dataPoint: Record<string, any> = { name: metric.name };
			processed.forEach((model) => {
				// Safe key access logic
				const key = metric.name
					.toLowerCase()
					.replace(" ", "_") as keyof typeof model;
				// Ensure we only grab number values for the chart
				const value = model[key];
				dataPoint[model.algorithm] =
					typeof value === "number" ? value : 0;
			});
			return dataPoint;
		});

		const best = processed.filter((p) => p.isBest);

		return {
			processedData: processed,
			chartData: charts,
			bestModels: best,
			maxScore,
		};
	}, []);

	return (
		<div className="min-h-screen bg-slate-50 font-sans pb-20 overflow-x-hidden">
			{/* --- Header Section (Dark Theme) --- */}
			<div className="relative pt-12 pb-32 md:pt-16 md:pb-48 bg-[#0F172A] overflow-hidden">
				{/* Background Gradients */}
				<div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute bottom-[0%] right-[-5%] w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

				<div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={staggerContainer}
						className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
					>
						<div className="max-w-3xl">
							<motion.div
								variants={fadeInUp}
								className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6"
							>
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
								</span>
								Data Synced: Live
							</motion.div>

							<motion.h1
								variants={fadeInUp}
								className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4"
							>
								Model{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
									Benchmarks
								</span>
							</motion.h1>
							<motion.p
								variants={fadeInUp}
								className="text-slate-400 text-lg max-w-2xl leading-relaxed"
							>
								Comparing{" "}
								<strong className="text-slate-200">
									{processedData.length} Algorithms
								</strong>
								. Current Top F1-Score:{" "}
								<span className="text-white font-bold">
									{maxScore}%
								</span>
							</motion.p>
						</div>

						<motion.div variants={fadeInUp} className="flex gap-3">
							<Button
								variant="outline"
								className="h-12 rounded-full border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white px-6 transition-all"
							>
								<Download className="h-4 w-4 mr-2" /> Export
							</Button>
							<Button className="h-12 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 font-bold shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:scale-105">
								<RefreshCw className="h-4 w-4 mr-2" /> Retrain
							</Button>
						</motion.div>
					</motion.div>
				</div>
			</div>

			{/* --- Main Content --- */}
			<div className="container mx-auto px-4 md:px-12 lg:px-24 -mt-20 relative z-20">
				<motion.div
					variants={staggerContainer}
					initial="hidden"
					animate="visible"
					className="space-y-8"
				>
					{/* --- KPI Cards --- */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{processedData.map((model) => {
							return (
								<motion.div
									key={model.algorithm}
									variants={fadeInUp}
									whileHover={{ y: -5 }}
								>
									{/* Fixed: Used a solid dark color (#1e293b) to ensure text is readable even if it overlaps the white background area */}
									<Card className="relative h-full overflow-hidden border border-slate-700 bg-[#1e293b] shadow-2xl rounded-3xl group">
										<div
											className={`absolute inset-0 bg-gradient-to-br ${
												model.isBest
													? "from-teal-500/10 to-transparent"
													: "from-blue-500/5 to-transparent"
											} pointer-events-none`}
										/>

										<CardContent className="p-8 relative">
											<div className="flex items-start justify-between mb-6">
												<div
													className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${model.border} ${model.bg}`}
												>
													<model.icon
														className="h-6 w-6"
														style={{
															color: model.color,
														}}
													/>
												</div>
												{model.isBest && (
													<div className="flex items-center gap-1 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
														<Zap className="h-3 w-3 text-teal-400 fill-teal-400" />
														<span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
															Best
														</span>
													</div>
												)}
											</div>

											<div>
												<h3 className="font-bold text-slate-400 text-xs mb-2 uppercase tracking-widest truncate">
													{model.algorithm}
												</h3>
												<div className="flex items-baseline gap-2 mb-2">
													<span className="text-5xl font-extrabold text-white tracking-tight">
														<Counter
															value={
																model.accuracy
															}
														/>
													</span>
													<span className="text-xl text-slate-500 font-bold">
														%
													</span>
												</div>
												<div className="flex items-center gap-2">
													{model.accuracy > 95 && (
														<span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full flex items-center border border-teal-400/20">
															<CheckCircle2 className="h-3 w-3 mr-1" />
															High Accuracy
														</span>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>

					{/* --- Charts & Insights --- */}
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-8">
						{/* Chart */}
						<motion.div
							variants={fadeInUp}
							className="xl:col-span-2"
						>
							<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white h-full overflow-hidden">
								<CardHeader className="p-8 pb-2">
									<CardTitle className="text-xl font-bold text-slate-900">
										Metric Comparison
									</CardTitle>
									<CardDescription className="text-slate-500">
										Visualizing performance across all key
										indicators.
									</CardDescription>
								</CardHeader>
								<CardContent className="p-4 md:p-8">
									<div className="h-[350px] w-full">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
											<BarChart
												data={chartData}
												margin={{
													top: 20,
													right: 0,
													left: -20,
													bottom: 0,
												}}
												barGap={8}
											>
												<CartesianGrid
													strokeDasharray="3 3"
													vertical={false}
													stroke="#f1f5f9"
												/>
												<XAxis
													dataKey="name"
													axisLine={false}
													tickLine={false}
													tick={{
														fill: "#64748b",
														fontSize: 13,
														fontWeight: 600,
													}}
													dy={12}
												/>
												<YAxis
													axisLine={false}
													tickLine={false}
													tick={{
														fill: "#94a3b8",
														fontSize: 12,
													}}
													domain={[90, 100]}
													tickFormatter={(value) =>
														`${value}`
													}
												/>
												<Tooltip
													cursor={{
														fill: "#f8fafc",
														radius: 8,
													}}
													contentStyle={{
														borderRadius: "12px",
														border: "1px solid #e2e8f0",
														boxShadow:
															"0 10px 15px -3px rgb(0 0 0 / 0.1)",
														padding: "12px",
														fontFamily:
															"sans-serif",
													}}
												/>
												<Legend
													iconType="circle"
													iconSize={8}
													wrapperStyle={{
														paddingTop: "30px",
														fontSize: "13px",
														fontWeight: 500,
													}}
												/>
												{processedData.map((model) => (
													<Bar
														key={model.algorithm}
														name={model.algorithm}
														dataKey={
															model.algorithm
														}
														fill={model.color}
														radius={[4, 4, 0, 0]}
														barSize={20}
														animationDuration={1500}
													/>
												))}
											</BarChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Insights */}
						<motion.div variants={fadeInUp} className="h-full">
							<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white h-full flex flex-col">
								<CardHeader className="p-8 pb-4">
									<CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
										<BrainCircuit className="h-5 w-5 text-teal-500" />
										AI Analysis
									</CardTitle>
								</CardHeader>
								<CardContent className="p-8 pt-2 space-y-6 flex-1">
									{processedData.map((item, idx) => (
										<div
											key={idx}
											className="flex gap-4 group"
										>
											<div
												className={`flex-shrink-0 h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
											>
												<item.icon
													className="h-5 w-5"
													style={{
														color: item.color,
													}}
												/>
											</div>
											<div>
												<h4
													className="font-bold text-sm mb-1"
													style={{
														color: item.color,
													}}
												>
													{item.algorithm}
												</h4>
												<p className="text-sm text-slate-600 leading-relaxed font-medium">
													Achieved{" "}
													<strong>
														{item.f1_score}%
													</strong>{" "}
													F1 Score.{" "}
													{item.isBest
														? "Top performing model."
														: "Viable alternative."}
												</p>
											</div>
										</div>
									))}

									{/* Recommendation Box */}
									<div className="mt-4 p-6 rounded-2xl bg-[#0F172A] text-white shadow-lg relative overflow-hidden">
										<div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/20 blur-2xl rounded-full" />
										<div className="relative z-10">
											<div className="flex items-center gap-2 mb-2">
												<Trophy className="h-4 w-4 text-yellow-400" />
												<span className="font-bold text-xs uppercase tracking-wider text-teal-400">
													Recommendation
												</span>
											</div>
											<p className="text-sm text-slate-300 leading-relaxed">
												Deploy{" "}
												{bestModels.map((m, i) => (
													<span key={m.algorithm}>
														{i > 0 && " or "}
														<span className="text-white font-bold">
															{m.algorithm}
														</span>
													</span>
												))}
												.{" "}
												{bestModels.length > 1
													? "Both"
													: "It"}{" "}
												achieved optimal performance at{" "}
												{maxScore}%.
											</p>
											<Button
												variant="link"
												className="text-white p-0 h-auto mt-3 text-xs font-bold hover:text-teal-400"
											>
												View Deployment Logs{" "}
												<ArrowRight className="ml-1 h-3 w-3" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* --- NEW SECTION: Model Diagnostics (Confusion Matrices) --- */}
					<motion.div variants={fadeInUp} className="pt-4">
						<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
							<CardHeader className="p-8 border-b border-slate-100">
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
											<Grid2X2 className="h-5 w-5 text-slate-500" />
										</div>
										<div>
											<CardTitle className="text-xl font-bold text-slate-900">
												Model Diagnostics
											</CardTitle>
											<CardDescription>
												Confusion Matrix visualization
												(Actual vs Predicted)
											</CardDescription>
										</div>
									</div>

									{/* Legend */}
									<div className="flex flex-wrap gap-4">
										{[
											{
												label: "TP",
												desc: "True Pos",
												color: "text-teal-600",
											},
											{
												label: "FP",
												desc: "False Pos",
												color: "text-red-500",
											},
											{
												label: "FN",
												desc: "False Neg",
												color: "text-red-500",
											},
											{
												label: "TN",
												desc: "True Neg",
												color: "text-slate-600",
											},
										].map((info) => (
											<div
												key={info.label}
												className="flex items-center gap-2"
											>
												<span
													className={`text-xs font-bold ${info.color} bg-slate-50 px-2 py-1 rounded`}
												>
													{info.label}
												</span>
												<span className="text-[11px] text-slate-400">
													{info.desc}
												</span>
											</div>
										))}
									</div>
								</div>
							</CardHeader>

							<CardContent className="p-8">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
									{processedData.map((model) => (
										<div
											key={model.algorithm}
											className="flex flex-col items-center"
										>
											<div className="flex items-center gap-2 mb-4">
												<model.icon
													className="h-4 w-4"
													style={{
														color: model.color,
													}}
												/>
												<h4 className="font-bold text-slate-700">
													{model.algorithm}
												</h4>
											</div>
											<ConfusionMatrixViz
												matrix={model.confusion_matrix}
												color={model.color}
											/>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* --- Bottom: Table --- */}
					<motion.div variants={fadeInUp}>
						<Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
							<CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between">
								<CardTitle className="text-xl font-bold text-slate-900">
									Detailed Metrics
								</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								{/* Fixed: Added overflow-x-auto to make table responsive on mobile */}
								<div className="overflow-x-auto">
									<Table className="min-w-[800px]">
										<TableHeader className="bg-slate-50">
											<TableRow className="hover:bg-transparent border-none">
												<TableHead className="w-[300px] text-xs font-bold uppercase tracking-widest text-slate-400 py-6 pl-8">
													Algorithm
												</TableHead>
												<TableHead className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 py-6">
													Accuracy
												</TableHead>
												<TableHead className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 py-6">
													Precision
												</TableHead>
												<TableHead className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 py-6">
													Recall
												</TableHead>
												<TableHead className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 py-6">
													F1-Score
												</TableHead>
												<TableHead className="text-right text-xs font-bold uppercase tracking-widest text-slate-400 py-6 pr-8">
													Status
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{processedData.map((model) => (
												<TableRow
													key={model.algorithm}
													className="hover:bg-slate-50/80 border-b border-slate-50 last:border-none transition-colors group"
												>
													<TableCell className="font-bold text-slate-700 py-5 pl-8">
														<div className="flex items-center gap-3">
															<div
																className="h-2 w-2 rounded-full"
																style={{
																	backgroundColor:
																		model.color,
																}}
															/>
															{model.algorithm}
														</div>
													</TableCell>
													<TableCell className="text-center font-semibold text-slate-600">
														{model.accuracy}%
													</TableCell>
													<TableCell className="text-center font-semibold text-slate-600">
														{model.precision}%
													</TableCell>
													<TableCell className="text-center font-semibold text-slate-600">
														{model.recall}%
													</TableCell>
													<TableCell
														className="text-center font-bold"
														style={{
															color: model.color,
														}}
													>
														{model.f1_score}%
													</TableCell>
													<TableCell className="text-right pr-8">
														<Badge className="font-bold px-3 py-1 rounded-full border-0 bg-teal-100 text-teal-700 hover:bg-teal-200">
															{model.status}
														</Badge>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
