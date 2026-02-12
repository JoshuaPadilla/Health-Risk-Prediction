import { createFileRoute } from "@tanstack/react-router";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Download,
	RefreshCw,
	Trees,
	Activity,
	Sigma,
	TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/model-benchmarking")({
	component: ModelBenchmarking,
});

// --- Data Configuration ---
// Matches the specific values shown in the dashboard image
const rawData = [
	{
		algorithm: "Random Forest",
		shortName: "Random Forest",
		accuracy: 94,
		precision: 91,
		recall: 90,
		f1_score: 92,
		display_score: 92.4, // Top card specific value
		trend: "+1.2%",
		status: "Deployed",
		color: "#10b981", // Emerald
		icon: Trees,
		desc: "Highest F1-Score Performance",
		isBest: true,
	},
	{
		algorithm: "Support Vector Machine",
		shortName: "SVM",
		accuracy: 88,
		precision: 89,
		recall: 82,
		f1_score: 88,
		display_score: 88.1,
		status: "Ready",
		color: "#a855f7", // Purple
		icon: Activity,
		desc: "Strong precision metrics",
		isBest: false,
	},
	{
		algorithm: "Logistic Regression",
		shortName: "Logistic Reg.",
		accuracy: 82,
		precision: 78,
		recall: 80,
		f1_score: 85,
		display_score: 85.6,
		status: "Ready",
		color: "#f97316", // Orange
		icon: Sigma,
		desc: "Baseline performance model",
		isBest: false,
	},
];

// Transform data for Recharts to match the specific bar grouping order
const chartData = [
	{
		name: "Accuracy",
		"Logistic Reg.": 82,
		SVM: 88,
		"Random Forest": 94,
	},
	{
		name: "Precision",
		"Logistic Reg.": 78,
		SVM: 89,
		"Random Forest": 91,
	},
	{
		name: "Recall",
		"Logistic Reg.": 80,
		SVM: 82,
		"Random Forest": 90,
	},
	{
		name: "F1-Score",
		"Logistic Reg.": 85,
		SVM: 88,
		"Random Forest": 92,
	},
];

function ModelBenchmarking() {
	return (
		<div className="min-h-screen bg-slate-50/50 p-6 md:px-24 space-y-8 font-sans">
			{/* --- Header --- */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
						AI Model Benchmarking
					</h1>
					<p className="text-slate-500 mt-2 max-w-2xl">
						Comparative analysis of Logistic Regression, SVM, and
						Random Forest algorithms for student health risk
						prediction.
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						variant="outline"
						className="gap-2 bg-white border-slate-200 text-slate-700 font-medium"
					>
						<Download className="h-4 w-4" /> Export Report
					</Button>
					<Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium">
						<RefreshCw className="h-4 w-4" /> Retrain Models
					</Button>
				</div>
			</div>

			{/* --- KPI Cards --- */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{rawData.map((model) => (
					<Card
						key={model.algorithm}
						className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-all bg-white"
					>
						{/* Colored Background Blob Effect */}
						<div
							className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none"
							style={{ backgroundColor: model.color }}
						/>

						<CardContent className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div
									className={`p-2.5 rounded-xl`}
									style={{
										backgroundColor: `${model.color}15`,
										color: model.color,
									}}
								>
									<model.icon className="h-6 w-6" />
								</div>
								{model.isBest && (
									<Badge
										variant="secondary"
										className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-md"
									>
										Current Best
									</Badge>
								)}
							</div>

							<div>
								<h3 className="font-medium text-slate-500 text-sm mb-1">
									{model.algorithm}
								</h3>
								<div className="flex items-baseline gap-3">
									<span className="text-4xl font-bold text-slate-900 tracking-tight">
										{model.display_score}%
									</span>
									{model.trend && (
										<span className="text-sm font-bold text-emerald-500 flex items-center">
											<TrendingUp className="h-4 w-4 mr-1" />{" "}
											{model.trend}
										</span>
									)}
								</div>
								<p className="text-xs text-slate-400 font-medium mt-3">
									{model.desc}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* --- Middle Section: Chart & Insights --- */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: Chart */}
				<Card className="lg:col-span-2 border-none shadow-sm bg-white">
					<CardHeader>
						<CardTitle className="text-lg font-bold text-slate-900">
							Performance Metrics Comparison
						</CardTitle>
						<CardDescription>
							Evaluating models across standard classification
							metrics.
						</CardDescription>
					</CardHeader>
					<CardContent className="pl-0">
						<div className="h-[350px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={chartData}
									margin={{
										top: 20,
										right: 30,
										left: 0,
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
											fontWeight: 500,
										}}
										dy={12}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#94a3b8", fontSize: 12 }}
										domain={[0, 100]}
										tickFormatter={(value) => `${value}%`}
										dx={-10}
									/>
									<Tooltip
										cursor={{ fill: "#f8fafc" }}
										contentStyle={{
											borderRadius: "12px",
											border: "none",
											boxShadow:
												"0 10px 15px -3px rgb(0 0 0 / 0.1)",
											padding: "12px",
										}}
									/>
									<Legend
										iconType="circle"
										iconSize={8}
										wrapperStyle={{
											paddingTop: "24px",
											fontSize: "13px",
											fontWeight: 500,
											color: "#475569",
										}}
									/>
									<Bar
										name="Logistic Reg."
										dataKey="Logistic Reg."
										fill="#f97316"
										radius={[4, 4, 0, 0]}
										barSize={28}
									/>
									<Bar
										name="SVM"
										dataKey="SVM"
										fill="#a855f7"
										radius={[4, 4, 0, 0]}
										barSize={28}
									/>
									<Bar
										name="Random Forest"
										dataKey="Random Forest"
										fill="#10b981"
										radius={[4, 4, 0, 0]}
										barSize={28}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Right: Insights & Recommendations */}
				<Card className="border-none shadow-sm bg-white h-full">
					<CardHeader>
						<CardTitle className="text-lg font-bold text-slate-900">
							Key Insights & Recommendations
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Random Forest Insight */}
						<div className="flex gap-4">
							<div className="flex-shrink-0 h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
								<Trees className="h-5 w-5" />
							</div>
							<div>
								<p className="text-sm text-slate-600 leading-relaxed">
									<span className="font-bold text-slate-800">
										Random Forest
									</span>{" "}
									remains the top-performing model across all
									metrics.
								</p>
							</div>
						</div>

						{/* SVM Insight */}
						<div className="flex gap-4">
							<div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
								<Activity className="h-5 w-5" />
							</div>
							<div>
								<p className="text-sm text-slate-600 leading-relaxed">
									<span className="font-bold text-slate-800">
										Support Vector Machine
									</span>{" "}
									shows strong precision but lags in recall.
								</p>
							</div>
						</div>

						{/* LogReg Insight */}
						<div className="flex gap-4">
							<div className="flex-shrink-0 h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
								<Sigma className="h-5 w-5" />
							</div>
							<div>
								<p className="text-sm text-slate-600 leading-relaxed">
									<span className="font-bold text-slate-800">
										Logistic Regression
									</span>{" "}
									is the baseline, suitable for quick checks.
								</p>
							</div>
						</div>

						{/* Recommendation Box */}
						<div className="mt-2 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4 items-start">
							<div className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
								<div className="h-1.5 w-1.5 rounded-full bg-white" />
							</div>
							<p className="text-sm text-slate-700 leading-relaxed">
								<span className="font-bold text-slate-900">
									Recommendation:
								</span>{" "}
								Continue with Random Forest for current
								production. Investigate hyperparameter tuning
								for SVM to improve recall. Consider retraining
								all models with larger, more diverse dataset for
								better generalization.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* --- Bottom: Raw Performance Data Table --- */}
			<Card className="border-none shadow-sm bg-white overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
					<CardTitle className="text-lg font-bold text-slate-900">
						Raw Performance Data
					</CardTitle>
					<Button
						variant="link"
						className="text-blue-600 font-semibold h-auto p-0 hover:no-underline"
					>
						View Full Dataset
					</Button>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader className="bg-slate-50/50">
							<TableRow className="hover:bg-transparent border-none">
								<TableHead className="w-[300px] text-xs font-bold uppercase tracking-wider text-slate-400 py-4 pl-6">
									Algorithm
								</TableHead>
								<TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-4">
									Accuracy
								</TableHead>
								<TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-4">
									Precision
								</TableHead>
								<TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-4">
									Recall
								</TableHead>
								<TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-4">
									F1-Score
								</TableHead>
								<TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-400 py-4 pr-6">
									Status
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rawData.map((model) => (
								<TableRow
									key={model.algorithm}
									className="hover:bg-slate-50/50 border-b border-slate-50 last:border-none"
								>
									<TableCell className="font-semibold text-slate-700 py-4 pl-6">
										<div className="flex items-center gap-3">
											<div
												className="h-6 w-1.5 rounded-full"
												style={{
													backgroundColor:
														model.color,
												}}
											/>
											{model.algorithm}
										</div>
									</TableCell>
									<TableCell className="text-center font-medium text-slate-600">
										{model.accuracy}%
									</TableCell>
									<TableCell className="text-center font-medium text-slate-600">
										{model.precision}%
									</TableCell>
									<TableCell className="text-center font-medium text-slate-600">
										{model.recall}%
									</TableCell>
									<TableCell
										className="text-center font-bold"
										style={{ color: model.color }}
									>
										{model.f1_score}%
									</TableCell>
									<TableCell className="text-right pr-6">
										<Badge
											variant="secondary"
											className={`
                        font-medium px-3 py-1 rounded-full
                        ${
							model.status === "Deployed"
								? "bg-emerald-100 text-emerald-700"
								: "bg-slate-100 text-slate-500"
						}
                      `}
										>
											{model.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
