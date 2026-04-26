import { Badge } from "@/components/ui/badge";
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
import { LocalBenchmarks } from "@/static_data/local_benchmarks";
import {
	ModelBenchmarks,
	type BenchmarkEntry,
} from "@/static_data/model_benchmarks";
import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	BarChart3,
	CheckCircle2,
	FileText,
	FlaskConical,
	Scale,
	ShieldCheck,
	Target,
	Trophy,
} from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/model-benchmarking")({
	component: ModelBenchmarking,
});

type MetricKey = keyof Pick<
	BenchmarkEntry,
	"accuracy" | "precision" | "recall" | "f1_score"
>;

type ComparisonRow = {
	algorithm: string;
	production: BenchmarkEntry | null;
	local: BenchmarkEntry | null;
	accuracyDelta: number | null;
	f1Delta: number | null;
	productionCorrect: number | null;
	productionErrors: number | null;
	productionTotal: number | null;
	localCorrect: number | null;
	localErrors: number | null;
	localTotal: number | null;
	interpretation: string;
};

const metricLabels: Array<{ key: MetricKey; label: string }> = [
	{ key: "accuracy", label: "Accuracy" },
	{ key: "precision", label: "Precision" },
	{ key: "recall", label: "Recall" },
	{ key: "f1_score", label: "F1 Score" },
];

const productionMap = new Map(
	ModelBenchmarks.map((entry) => [entry.algorithm, entry]),
);
const localMap = new Map(
	LocalBenchmarks.map((entry) => [entry.algorithm, entry]),
);

const comparisonRows: ComparisonRow[] = Array.from(
	new Set([
		...ModelBenchmarks.map((entry) => entry.algorithm),
		...LocalBenchmarks.map((entry) => entry.algorithm),
	]),
)
	.map((algorithm) => {
		const production = productionMap.get(algorithm) ?? null;
		const local = localMap.get(algorithm) ?? null;
		const productionStats = getMatrixStats(production);
		const localStats = getMatrixStats(local);

		return {
			algorithm,
			production,
			local,
			accuracyDelta:
				production && local
					? Number((production.accuracy - local.accuracy).toFixed(1))
					: null,
			f1Delta:
				production && local
					? Number((production.f1_score - local.f1_score).toFixed(1))
					: null,
			productionCorrect: productionStats?.correct ?? null,
			productionErrors: productionStats?.errors ?? null,
			productionTotal: productionStats?.total ?? null,
			localCorrect: localStats?.correct ?? null,
			localErrors: localStats?.errors ?? null,
			localTotal: localStats?.total ?? null,
			interpretation: buildInterpretation(algorithm, production, local),
		};
	})
	.sort((left, right) => {
		const rightScore = right.production?.f1_score ?? -1;
		const leftScore = left.production?.f1_score ?? -1;
		return rightScore - leftScore;
	});

const strongestProductionF1 = getBestAlgorithms(ModelBenchmarks, "f1_score");
const strongestLocalF1 = getBestAlgorithms(LocalBenchmarks, "f1_score");
const productionLeads = comparisonRows.filter(
	(row) => row.f1Delta != null && row.f1Delta > 0,
).length;
const bestProductionF1Value = Math.max(
	...ModelBenchmarks.map((entry) => entry.f1_score),
);
const bestLocalF1Value = Math.max(
	...LocalBenchmarks.map((entry) => entry.f1_score),
);

function formatValue(value?: number | null) {
	if (value == null || Number.isNaN(value)) {
		return "--";
	}

	return `${value.toFixed(1)}%`;
}

function formatDelta(value: number | null) {
	if (value == null) {
		return "--";
	}

	return `${value > 0 ? "+" : ""}${value.toFixed(1)} pts`;
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

function getMatrixStats(entry: BenchmarkEntry | null) {
	if (!entry) {
		return null;
	}

	const trueNegative = entry.confusion_matrix[0]?.[0] ?? 0;
	const falsePositive = entry.confusion_matrix[0]?.[1] ?? 0;
	const falseNegative = entry.confusion_matrix[1]?.[0] ?? 0;
	const truePositive = entry.confusion_matrix[1]?.[1] ?? 0;
	const correct = trueNegative + truePositive;
	const errors = falsePositive + falseNegative;

	return {
		correct,
		errors,
		total: correct + errors,
	};
}

function buildInterpretation(
	algorithm: string,
	production: BenchmarkEntry | null,
	local: BenchmarkEntry | null,
) {
	if (!production || !local) {
		return `Only one result set is available for ${algorithm}.`;
	}

	const f1Delta = production.f1_score - local.f1_score;
	const accuracyDelta = production.accuracy - local.accuracy;
	const strongerSource =
		f1Delta >= 0 ? "Reference benchmark" : "Local evaluation";

	return `${strongerSource} results lead by ${Math.abs(f1Delta).toFixed(1)} F1 points and ${Math.abs(accuracyDelta).toFixed(1)} accuracy points.`;
}

function ConfusionMatrixPanel({
	title,
	entry,
	accentClassName,
	note,
}: {
	title: string;
	entry: BenchmarkEntry | null;
	accentClassName: string;
	note: string;
}) {
	const trueNegative = entry?.confusion_matrix[0]?.[0] ?? 0;
	const falsePositive = entry?.confusion_matrix[0]?.[1] ?? 0;
	const falseNegative = entry?.confusion_matrix[1]?.[0] ?? 0;
	const truePositive = entry?.confusion_matrix[1]?.[1] ?? 0;

	return (
		<div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-4">
			<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
				{title}
			</p>
			<div className="mt-4 grid grid-cols-2 gap-2 text-center font-mono text-xs">
				<div className="rounded-2xl bg-emerald-50 px-3 py-3 text-emerald-700">
					<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/80">
						TN
					</div>
					<div className="mt-2 text-lg font-bold text-slate-950">
						{trueNegative}
					</div>
				</div>
				<div className="rounded-2xl bg-rose-50 px-3 py-3 text-rose-700">
					<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-300/80">
						FP
					</div>
					<div className="mt-2 text-lg font-bold text-slate-950">
						{falsePositive}
					</div>
				</div>
				<div className="rounded-2xl bg-rose-50 px-3 py-3 text-rose-700">
					<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-300/80">
						FN
					</div>
					<div className="mt-2 text-lg font-bold text-slate-950">
						{falseNegative}
					</div>
				</div>
				<div className="rounded-2xl bg-emerald-50 px-3 py-3 text-emerald-700">
					<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/80">
						TP
					</div>
					<div className="mt-2 text-lg font-bold text-slate-950">
						{truePositive}
					</div>
				</div>
			</div>
			<div
				className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${accentClassName}`}
			>
				{note}
			</div>
		</div>
	);
}

function ResultCard({ row }: { row: ComparisonRow }) {
	return (
		<Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60">
			<CardHeader className="border-b border-slate-100 p-8 pb-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<CardTitle className="text-2xl text-slate-950">
							{row.algorithm}
						</CardTitle>
						<CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
							{row.interpretation}
						</CardDescription>
					</div>
					<Badge className="border border-slate-200 bg-slate-50 text-slate-700">
						F1 gap: {formatDelta(row.f1Delta)}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="grid gap-6 p-8 lg:grid-cols-[1fr_1fr_0.9fr]">
				<div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
						Reference Benchmark
					</p>
					<div className="mt-4 space-y-3">
						{metricLabels.map((metric) => (
							<div
								key={`${row.algorithm}-production-${metric.key}`}
								className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3"
							>
								<span className="text-sm font-medium text-slate-500">
									{metric.label}
								</span>
								<span className="text-base font-bold text-slate-900">
									{formatValue(row.production?.[metric.key])}
								</span>
							</div>
						))}
					</div>
					<div className="mt-4 border-t border-slate-200 pt-4">
						<ConfusionMatrixPanel
							title="Reference confusion matrix"
							entry={row.production}
							accentClassName="bg-sky-500/12 text-sky-700"
							note="Based on the reference benchmark confusion matrix"
						/>
					</div>
				</div>

				<div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
						Local Evaluation
					</p>
					<div className="mt-4 space-y-3">
						{metricLabels.map((metric) => (
							<div
								key={`${row.algorithm}-local-${metric.key}`}
								className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-4 py-3"
							>
								<span className="text-sm font-medium text-slate-500">
									{metric.label}
								</span>
								<span className="text-base font-bold text-slate-900">
									{formatValue(row.local?.[metric.key])}
								</span>
							</div>
						))}
					</div>
					<div className="mt-4 border-t border-emerald-100 pt-4">
						<ConfusionMatrixPanel
							title="Local confusion matrix"
							entry={row.local}
							accentClassName="bg-emerald-500/12 text-emerald-700"
							note="Based on the local evaluation confusion matrix"
						/>
					</div>
				</div>

				<div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-[#0f172a] p-5 text-slate-100">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
							Quick read
						</p>
						<p className="mt-3 text-sm leading-6 text-slate-300">
							Reference accuracy gap:{" "}
							{formatDelta(row.accuracyDelta)}
						</p>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
						<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
							Reference classification
						</p>
						<p className="mt-2 text-lg font-bold text-white">
							{row.productionCorrect ?? "--"}/
							{row.productionTotal ?? "--"}
						</p>
						<p className="text-sm text-slate-300">
							Correct predictions, with{" "}
							{row.productionErrors ?? "--"} errors.
						</p>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
						<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
							Local classification
						</p>
						<p className="mt-2 text-lg font-bold text-white">
							{row.localCorrect ?? "--"}/{row.localTotal ?? "--"}
						</p>
						<p className="text-sm text-slate-300">
							Correct predictions, with {row.localErrors ?? "--"}{" "}
							errors.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function ModelBenchmarking() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe_0%,#f8fafc_42%,#f8fafc_100%)] pb-20">
			<div className="relative overflow-hidden bg-[#0f172a] pb-28 pt-14 md:pb-36 md:pt-18">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[48px_48px] opacity-10" />
				<div className="absolute left-[-8%] top-[-25%] h-120 w-120 rounded-full bg-sky-500/18 blur-[110px]" />
				<div className="absolute bottom-[-25%] right-[-6%] h-105 w-105 rounded-full bg-emerald-500/18 blur-[110px]" />

				<div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
					<div className="max-w-4xl">
						<Badge className="mb-5 border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-300">
							<FileText className="mr-1 h-3.5 w-3.5" />
							Static Benchmark Report
						</Badge>
						<h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
							Model benchmarking results, explained and compared.
						</h1>
						<p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
							This page only presents the benchmark results. It
							compares the reference benchmark set against the
							local evaluation set for each model and explains
							what the metric gaps mean in plain terms.
						</p>
					</div>
				</div>
			</div>

			<div className="container relative z-20 mx-auto -mt-16 space-y-8 px-4 md:px-12 lg:px-24">
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
						<CardHeader className="p-7 pb-3">
							<CardTitle className="flex items-center gap-3 text-xl text-slate-900">
								<div className="rounded-2xl bg-sky-500/10 p-3 text-sky-600">
									<ShieldCheck className="h-5 w-5" />
								</div>
								Reference set
							</CardTitle>
							<CardDescription className="text-sm leading-6 text-slate-500">
								These are the baseline model benchmark results
								used as the primary reference on this page.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-7 pt-0 text-sm leading-6 text-slate-600">
							{productionLeads} of {comparisonRows.length} models
							score higher on F1 here than on the local evaluation
							set.
						</CardContent>
					</Card>

					<Card className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
						<CardHeader className="p-7 pb-3">
							<CardTitle className="flex items-center gap-3 text-xl text-slate-900">
								<div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
									<FlaskConical className="h-5 w-5" />
								</div>
								Local set
							</CardTitle>
							<CardDescription className="text-sm leading-6 text-slate-500">
								These results come from the local evaluation
								dataset and are shown only for direct
								comparison.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-7 pt-0 text-sm leading-6 text-slate-600">
							The strongest local F1 score comes from{" "}
							{joinLabels(strongestLocalF1)} at{" "}
							{formatValue(bestLocalF1Value)}.
						</CardContent>
					</Card>

					<Card className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
						<CardHeader className="p-7 pb-3">
							<CardTitle className="flex items-center gap-3 text-xl text-slate-900">
								<div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600">
									<Trophy className="h-5 w-5" />
								</div>
								Top reference result
							</CardTitle>
							<CardDescription className="text-sm leading-6 text-slate-500">
								The highest reference F1 score is shared by{" "}
								{joinLabels(strongestProductionF1)}.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-7 pt-0 text-sm leading-6 text-slate-600">
							Each of those models reaches{" "}
							{formatValue(bestProductionF1Value)} F1 on the
							reference benchmark set.
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
						<CardHeader className="p-7 pb-4">
							<CardTitle className="flex items-center gap-3 text-lg text-slate-900">
								<Target className="h-5 w-5 text-sky-600" />
								Accuracy
							</CardTitle>
						</CardHeader>
						<CardContent className="p-7 pt-0 text-sm leading-6 text-slate-600">
							Accuracy shows the share of total predictions that
							were correct. Higher values mean fewer overall
							mistakes.
						</CardContent>
					</Card>

					<Card className="rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
						<CardHeader className="p-7 pb-4">
							<CardTitle className="flex items-center gap-3 text-lg text-slate-900">
								<Scale className="h-5 w-5 text-emerald-600" />
								Precision and Recall
							</CardTitle>
						</CardHeader>
						<CardContent className="p-7 pt-0 text-sm leading-6 text-slate-600">
							Precision reflects how often positive predictions
							were right. Recall shows how many actual positive
							cases the model captured.
						</CardContent>
					</Card>

					<Card className="rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
						<CardHeader className="p-7 pb-4">
							<CardTitle className="flex items-center gap-3 text-lg text-slate-900">
								<BarChart3 className="h-5 w-5 text-amber-600" />
								F1 Score and Outcomes
							</CardTitle>
						</CardHeader>
						<CardContent className="p-7 pt-0 text-sm leading-6 text-slate-600">
							F1 score balances precision and recall. The
							classification totals shown below summarize correct
							predictions versus combined false positives and
							false negatives.
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<div className="flex items-center gap-3">
						<div className="rounded-2xl bg-slate-900 p-3 text-white">
							<Activity className="h-5 w-5" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-slate-950">
								Model-by-model comparison
							</h2>
							<p className="text-sm text-slate-500">
								Each card compares one model across both result
								sets without any route-level interactivity.
							</p>
						</div>
					</div>

					{comparisonRows.map((row) => (
						<ResultCard key={row.algorithm} row={row} />
					))}
				</div>

				<Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
					<CardHeader className="border-b border-slate-100 p-8 pb-4">
						<CardTitle className="flex items-center gap-3 text-xl text-slate-900">
							<CheckCircle2 className="h-5 w-5 text-emerald-600" />
							Result summary table
						</CardTitle>
						<CardDescription className="text-sm leading-6 text-slate-500">
							Compact comparison of the main result values across
							the reference and local benchmark sets.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<Table className="min-w-230">
								<TableHeader className="bg-slate-50">
									<TableRow className="hover:bg-transparent">
										<TableHead className="py-5 pl-8 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
											Algorithm
										</TableHead>
										<TableHead className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
											Reference Accuracy
										</TableHead>
										<TableHead className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
											Local Accuracy
										</TableHead>
										<TableHead className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
											Reference F1
										</TableHead>
										<TableHead className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
											Local F1
										</TableHead>
										<TableHead className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
											F1 Gap
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{comparisonRows.map((row) => (
										<TableRow
											key={`${row.algorithm}-summary`}
											className="border-b border-slate-100 hover:bg-slate-50/60"
										>
											<TableCell className="py-5 pl-8 font-semibold text-slate-900">
												{row.algorithm}
											</TableCell>
											<TableCell className="text-center font-semibold text-slate-700">
												{formatValue(
													row.production?.accuracy,
												)}
											</TableCell>
											<TableCell className="text-center font-semibold text-slate-700">
												{formatValue(
													row.local?.accuracy,
												)}
											</TableCell>
											<TableCell className="text-center font-semibold text-slate-700">
												{formatValue(
													row.production?.f1_score,
												)}
											</TableCell>
											<TableCell className="text-center font-semibold text-slate-700">
												{formatValue(
													row.local?.f1_score,
												)}
											</TableCell>
											<TableCell className="text-center font-semibold text-slate-900">
												{formatDelta(row.f1Delta)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
