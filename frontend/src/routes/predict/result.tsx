import { createFileRoute, redirect } from "@tanstack/react-router";
import { usePredictionStore } from "@/stores/prediction_store";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ShieldCheck,
	Printer,
	Download,
	Moon,
	Activity,
	Scale,
	HeartPulse,
	RefreshCcw,
	UserPlus,
	ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/predict/result")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.prediction.predictionResult) {
			throw redirect({ to: "/predict" });
		}
	},
});

const getIcon = (category: string, iconName?: string) => {
	if (iconName === "shield-check")
		return <ShieldCheck className="h-16 w-16" />;

	switch (category) {
		case "Sleep Health":
			return <Moon className="h-6 w-6 text-indigo-500" />;
		case "Mental Wellness":
			return <Activity className="h-6 w-6 text-pink-500" />;
		case "Physical Health":
			return <Scale className="h-6 w-6 text-orange-500" />;
		case "Lifestyle":
			return <HeartPulse className="h-6 w-6 text-emerald-500" />;
		default:
			return <Activity className="h-6 w-6" />;
	}
};

const getStatusStyles = (status: string, color?: string) => {
	const isSuccess = status === "success" || color === "green";
	const isWarning = status === "warning" || color === "yellow";

	if (isSuccess)
		return {
			bg: "bg-emerald-50",
			border: "border-emerald-100",
			text: "text-emerald-700",
			badge: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
			icon: "text-emerald-600",
		};
	if (isWarning)
		return {
			bg: "bg-amber-50",
			border: "border-amber-100",
			text: "text-amber-700",
			badge: "bg-amber-100 text-amber-800 hover:bg-amber-100",
			icon: "text-amber-600",
		};
	return {
		bg: "bg-slate-50",
		border: "border-slate-200",
		text: "text-slate-700",
		badge: "bg-slate-100 text-slate-800",
		icon: "text-slate-600",
	};
};

function RouteComponent() {
	const { predictionResult } = usePredictionStore();

	if (!predictionResult) return null;

	const { riskRecommendation, recommendations } = predictionResult;
	const mainStyles = getStatusStyles(riskRecommendation.status);

	return (
		<div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">
							Assessment Results
						</h1>
						<p className="text-slate-500 mt-1">
							Generated on {new Date().toLocaleDateString()} • AI
							Prediction Model {predictionResult.model_used}
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" className="gap-2 bg-white">
							<Printer className="h-4 w-4" /> Print
						</Button>
						<Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
							<Download className="h-4 w-4" /> Download Report
						</Button>
					</div>
				</div>

				{/* Main Risk Status Card */}
				<Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
					<div className="grid md:grid-cols-[300px_1fr]">
						<div
							className={`${mainStyles.bg} flex flex-col items-center justify-center p-10 border-r ${mainStyles.border}`}
						>
							<div
								className={`rounded-full bg-white p-6 shadow-sm mb-6 ${mainStyles.icon}`}
							>
								{getIcon("", riskRecommendation.icon)}
							</div>
							<Badge
								variant="outline"
								className={`${mainStyles.badge} px-4 py-1.5 border-0 font-bold tracking-wide uppercase`}
							>
								STATUS: {predictionResult.status}
							</Badge>
						</div>

						<div className="p-8 md:p-12 flex flex-col justify-center bg-white">
							<h2 className="text-3xl font-bold text-slate-900 mb-4">
								{riskRecommendation.title}
							</h2>
							<p className="text-lg text-slate-600 leading-relaxed mb-6">
								{riskRecommendation.message}
							</p>
							<div className="flex items-center gap-2 pt-6 border-t border-slate-100">
								<Activity className="h-5 w-5 text-blue-500" />
								<span className="font-medium text-slate-700">
									Health Score:{" "}
									<span className="text-slate-900 font-bold text-lg">
										{riskRecommendation.score}/100
									</span>
								</span>
							</div>
						</div>
					</div>
				</Card>

				{/* Recommendations Grid - CHANGED TO 2 COLUMNS */}
				<div>
					<h3 className="text-xl font-bold text-slate-900 mb-6">
						Your Personal Recommendations
					</h3>

					{/* Changed md:grid-cols-3 to md:grid-cols-2 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{recommendations.map((rec: any, index: number) => {
							const styles = getStatusStyles(
								rec.status,
								rec.color,
							);

							return (
								<Card
									key={index}
									className="flex flex-col h-full border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
								>
									<CardHeader className="pb-3">
										<div className="flex items-center gap-4">
											<div
												className={`w-12 h-12 rounded-lg ${styles.bg} flex items-center justify-center shrink-0`}
											>
												{getIcon(rec.category)}
											</div>
											<div>
												<CardTitle className="text-lg font-bold text-slate-900">
													{rec.title}
												</CardTitle>
												<CardDescription className="text-slate-500 font-medium">
													{rec.category}
												</CardDescription>
											</div>
										</div>
									</CardHeader>
									<CardContent className="flex-1">
										<p className="text-slate-600 text-sm leading-relaxed">
											{rec.message}
										</p>
									</CardContent>
									<CardFooter className="pt-0 pb-6">
										<Button
											variant="link"
											className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800 gap-1"
										>
											View Guide{" "}
											<ArrowRight className="h-3 w-3" />
										</Button>
									</CardFooter>
								</Card>
							);
						})}
					</div>
				</div>

				{/* Footer */}
				<div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
					<div>
						<h4 className="text-lg font-bold text-slate-900">
							Need a second opinion?
						</h4>
						<p className="text-slate-500 text-sm">
							Consult with a professional counselor or nurse.
						</p>
					</div>
					<div className="flex gap-3">
						<Button variant="outline" className="bg-white gap-2">
							<RefreshCcw className="h-4 w-4" /> Retake Assessment
						</Button>
						<Button className="gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
							<UserPlus className="h-4 w-4" /> Find a Specialist
						</Button>
					</div>
				</div>

				<p className="text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed pb-8">
					Disclaimer: This assessment is an AI-powered prediction and
					does not constitute a medical diagnosis.
				</p>
			</div>
		</div>
	);
}
