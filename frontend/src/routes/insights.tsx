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
	Building2,
	CalendarClock,
	Database,
	RefreshCcw,
	TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

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
	const [activeTab, setActiveTab] = useState<"records" | "department">(
		"records",
	);
	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = 8;

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

	useEffect(() => {
		setCurrentPage((page) => {
			const totalPages = Math.max(
				1,
				Math.ceil(records.length / recordsPerPage),
			);

			return Math.min(page, totalPages);
		});
	}, [records, recordsPerPage]);

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

	const totalPages = Math.max(1, Math.ceil(records.length / recordsPerPage));
	const currentPageRecords = useMemo(() => {
		const start = (currentPage - 1) * recordsPerPage;
		return records.slice(start, start + recordsPerPage);
	}, [currentPage, records, recordsPerPage]);

	const pageNumbers = useMemo(() => {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}, [totalPages]);

	const insightsByDepartment = useMemo(() => {
		const grouped = new Map<
			string,
			{ total: number; latestCreatedAt: string | null }
		>();

		for (const record of records) {
			const department = record.department ?? "Unassigned";
			const existing = grouped.get(department);

			if (!existing) {
				grouped.set(department, {
					total: 1,
					latestCreatedAt: record.createdAt,
				});
				continue;
			}

			const latestExisting = existing.latestCreatedAt
				? new Date(existing.latestCreatedAt).getTime()
				: 0;
			const currentCreatedAt = new Date(record.createdAt).getTime();

			existing.total += 1;
			if (
				!Number.isNaN(currentCreatedAt) &&
				currentCreatedAt > latestExisting
			) {
				existing.latestCreatedAt = record.createdAt;
			}
		}

		return Array.from(grouped.entries())
			.map(([department, data]) => ({
				department,
				total: data.total,
				latestCreatedAt: data.latestCreatedAt,
			}))
			.sort(
				(a, b) =>
					b.total - a.total ||
					a.department.localeCompare(b.department),
			);
	}, [records]);

	const departmentChartData = useMemo(() => {
		return insightsByDepartment.map((item) => ({
			department: item.department,
			records: item.total,
			share: totalRecords > 0 ? (item.total / totalRecords) * 100 : 0,
		}));
	}, [insightsByDepartment, totalRecords]);

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
							{activeTab === "records" ? (
								<Activity className="h-5 w-5 text-cyan-700" />
							) : (
								<Building2 className="h-5 w-5 text-cyan-700" />
							)}
							{activeTab === "records"
								? "Recent Prediction Records"
								: "Insights by Department"}
						</CardTitle>
						<CardDescription>
							{activeTab === "records"
								? "Newest records are shown first."
								: "Compare record volume and recency by department."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="mb-4 flex flex-wrap items-center gap-2">
							<Button
								variant={
									activeTab === "records"
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setActiveTab("records")}
							>
								Records
							</Button>
							<Button
								variant={
									activeTab === "department"
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setActiveTab("department")}
							>
								By Department
							</Button>
						</div>

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

						{records.length > 0 && activeTab === "records" ? (
							<div className="space-y-3">
								{currentPageRecords.map((record) => (
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

								{totalPages > 1 ? (
									<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
										<p className="text-sm text-slate-500">
											Page {currentPage} of {totalPages}
										</p>
										<div className="flex flex-wrap items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setCurrentPage((page) =>
														Math.max(page - 1, 1),
													)
												}
												disabled={currentPage === 1}
											>
												Previous
											</Button>

											<div className="flex flex-wrap items-center gap-2">
												{pageNumbers.map((page) => (
													<Button
														key={page}
														variant={
															page === currentPage
																? "default"
																: "outline"
														}
														size="sm"
														onClick={() =>
															setCurrentPage(page)
														}
													>
														{page}
													</Button>
												))}
											</div>

											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setCurrentPage((page) =>
														Math.min(
															page + 1,
															totalPages,
														),
													)
												}
												disabled={
													currentPage === totalPages
												}
											>
												Next
											</Button>
										</div>
									</div>
								) : null}
							</div>
						) : null}

						{records.length > 0 && activeTab === "department" ? (
							<div className="space-y-3">
								<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4">
									<p className="mb-3 text-sm font-medium text-slate-700">
										Department submission distribution
									</p>
									<div className="h-64 w-full">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
											<BarChart
												data={departmentChartData}
												margin={{
													top: 8,
													right: 8,
													left: 4,
													bottom: 8,
												}}
											>
												<CartesianGrid
													strokeDasharray="3 3"
													stroke="#e2e8f0"
												/>
												<XAxis
													dataKey="department"
													tick={{
														fill: "#475569",
														fontSize: 12,
													}}
													interval={0}
													angle={
														departmentChartData.length >
														5
															? -15
															: 0
													}
													height={
														departmentChartData.length >
														5
															? 60
															: 40
													}
													textAnchor={
														departmentChartData.length >
														5
															? "end"
															: "middle"
													}
												/>
												<YAxis
													allowDecimals={false}
													tick={{
														fill: "#475569",
														fontSize: 12,
													}}
												/>
												<Tooltip
													formatter={(
														value: number,
													) => [value, "Records"]}
													labelStyle={{
														color: "#0f172a",
													}}
													contentStyle={{
														borderRadius: "0.75rem",
														border: "1px solid #cbd5e1",
														backgroundColor:
															"#f8fafc",
													}}
												/>
												<Bar
													dataKey="records"
													fill="#06b6d4"
													radius={[8, 8, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>

								{insightsByDepartment.map((item) => (
									<div
										key={item.department}
										className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
									>
										<div>
											<p className="font-semibold text-slate-900">
												{item.department}
											</p>
											<p className="text-sm text-slate-500">
												Total records: {item.total}
											</p>
										</div>
										<p className="text-sm text-slate-600">
											Latest:{" "}
											<Badge className="mt-2 border border-cyan-200 bg-cyan-50 text-cyan-700">
												{(
													(item.total /
														totalRecords) *
													100
												).toFixed(1)}
												%
											</Badge>
											{formatDate(item.latestCreatedAt)}
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
