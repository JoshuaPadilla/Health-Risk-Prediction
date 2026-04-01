import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BaseUrl } from "@/lib/base_url";
import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	CalendarClock,
	Database,
	RefreshCcw,
	TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/insights")({
	component: InsightsPage,
});

type PredictionRecord = {
	id: string;
	model: string;
	department: string | null;
	createdAt: string;
};

function formatDate(value: string | null) {
	if (!value) return "No records yet";

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "Unknown";

	return parsed.toLocaleString();
}

function InsightsPage() {
	const [records, setRecords] = useState<PredictionRecord[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchRecords = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`${BaseUrl}prediction/records`);

			if (!response.ok) {
				throw new Error(`Unable to load records (${response.status})`);
			}

			const payload = (await response.json()) as PredictionRecord[];
			setRecords(Array.isArray(payload) ? payload : []);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unable to load insights";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRecords();
	}, [fetchRecords]);

	const totalRecords = records.length;
	const latestRecordAt = records[0]?.createdAt ?? null;

	const recordsInLastWeek = useMemo(() => {
		const now = Date.now();
		const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

		return records.filter((record) => {
			const createdAt = new Date(record.createdAt).getTime();
			return !Number.isNaN(createdAt) && createdAt >= oneWeekAgo;
		}).length;
	}, [records]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-10 md:py-14">
			<div className="container mx-auto px-4 md:px-12 lg:px-24 space-y-8">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<Badge className="border border-cyan-200 bg-cyan-50 text-cyan-700">
							Prediction Intelligence
						</Badge>
						<h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
							Insights Dashboard
						</h1>
						<p className="mt-2 max-w-2xl text-slate-600">
							Track how many prediction records are being
							collected and monitor recent activity in real time.
						</p>
					</div>

					<Button
						onClick={fetchRecords}
						disabled={isLoading}
						className="bg-slate-900 text-white hover:bg-slate-800"
					>
						<RefreshCcw
							className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
						/>
						Refresh Data
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<Card className="border-slate-200 bg-white/90">
						<CardHeader className="pb-2">
							<CardDescription>
								Total Prediction Records
							</CardDescription>
							<CardTitle className="text-4xl text-slate-950">
								{totalRecords}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center gap-2 text-sm text-slate-500">
							<Database className="h-4 w-4 text-cyan-600" />
							All-time stored submissions
						</CardContent>
					</Card>

					<Card className="border-slate-200 bg-white/90">
						<CardHeader className="pb-2">
							<CardDescription>Last 7 Days</CardDescription>
							<CardTitle className="text-4xl text-slate-950">
								{recordsInLastWeek}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center gap-2 text-sm text-slate-500">
							<TrendingUp className="h-4 w-4 text-emerald-600" />
							New records during the current week
						</CardContent>
					</Card>

					<Card className="border-slate-200 bg-white/90">
						<CardHeader className="pb-2">
							<CardDescription>
								Latest Record Timestamp
							</CardDescription>
							<CardTitle className="text-lg text-slate-950 md:text-xl">
								{formatDate(latestRecordAt)}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center gap-2 text-sm text-slate-500">
							<CalendarClock className="h-4 w-4 text-indigo-600" />
							Most recent prediction capture
						</CardContent>
					</Card>
				</div>

				<Card className="border-slate-200 bg-white/95">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-slate-900">
							<Activity className="h-5 w-5 text-cyan-700" />
							Recent Prediction Records
						</CardTitle>
						<CardDescription>
							Newest records are shown first.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error ? (
							<p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
								{error}
							</p>
						) : null}

						{!error && !isLoading && records.length === 0 ? (
							<p className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
								No prediction records available yet.
							</p>
						) : null}

						{records.length > 0 ? (
							<div className="space-y-3">
								{records.slice(0, 8).map((record) => (
									<div
										key={record.id}
										className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
									>
										<div>
											<p className="font-semibold text-slate-900">
												Model: {record.model}
											</p>
											<p className="text-sm text-slate-500">
												Department:{" "}
												{record.department ?? "N/A"}
											</p>
										</div>
										<p className="text-sm text-slate-600">
											{formatDate(record.createdAt)}
										</p>
									</div>
								))}
							</div>
						) : null}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
