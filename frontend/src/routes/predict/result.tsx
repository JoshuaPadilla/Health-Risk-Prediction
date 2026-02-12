import { createFileRoute, redirect } from "@tanstack/react-router";
import { usePredictionStore } from "@/stores/prediction_store";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
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
	CheckCircle2,
	AlertTriangle,
	Info,
} from "lucide-react";
import {
	motion,
	useSpring,
	useTransform,
	useInView,
	type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/predict/result")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.prediction.predictionResult) {
			throw redirect({ to: "/predict" });
		}
	},
});

// --- Helpers ---

const getIcon = (category: string, iconName?: string) => {
	if (iconName === "shield-check")
		return <ShieldCheck className="h-16 w-16" />;
	if (iconName === "alert-triangle")
		return <AlertTriangle className="h-16 w-16" />;
	if (iconName === "check-circle")
		return <CheckCircle2 className="h-16 w-16" />;

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
			return <Info className="h-6 w-6 text-blue-500" />;
	}
};

const getStatusStyles = (status: string, color?: string) => {
	const isSuccess = status === "success" || color === "green";
	const isWarning = status === "warning" || color === "yellow";
	const isDanger = status === "danger" || color === "red";

	if (isSuccess)
		return {
			bg: "bg-emerald-50",
			border: "border-emerald-100",
			text: "text-emerald-700",
			badge: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
			icon: "text-emerald-600",
			ring: "ring-emerald-100",
		};
	if (isWarning)
		return {
			bg: "bg-amber-50",
			border: "border-amber-100",
			text: "text-amber-700",
			badge: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
			icon: "text-amber-600",
			ring: "ring-amber-100",
		};
	if (isDanger)
		return {
			bg: "bg-rose-50",
			border: "border-rose-100",
			text: "text-rose-700",
			badge: "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200",
			icon: "text-rose-600",
			ring: "ring-rose-100",
		};
	return {
		bg: "bg-slate-50",
		border: "border-slate-200",
		text: "text-slate-700",
		badge: "bg-slate-100 text-slate-800 border-slate-200",
		icon: "text-slate-600",
		ring: "ring-slate-100",
	};
};

// --- Animated Counter Component ---
function AnimatedCounter({ value }: { value: number }) {
	const spring = useSpring(0, { bounce: 0, duration: 1500 });
	const display = useTransform(spring, (current) => Math.round(current));

	useEffect(() => {
		spring.set(value);
	}, [spring, value]);

	return <motion.span>{display}</motion.span>;
}

// --- Animation Variants ---
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

const cardHoverVariants: Variants = {
	hover: {
		y: -5,
		boxShadow:
			"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
		transition: { duration: 0.2 },
	},
};

function RouteComponent() {
	const { predictionResult } = usePredictionStore();

	if (!predictionResult) return null;

	const { riskRecommendation, recommendations } = predictionResult;
	const mainStyles = getStatusStyles(riskRecommendation.status);

	return (
		<div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans overflow-x-hidden">
			<motion.div
				className="max-w-5xl mx-auto space-y-8"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Header */}
				<motion.div
					className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
					variants={itemVariants}
				>
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
							Assessment Results
						</h1>
						<p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
							Generated on {new Date().toLocaleDateString()}
							<span className="h-1 w-1 rounded-full bg-slate-300" />
							AI Prediction Model {predictionResult.model_used}
						</p>
					</div>
					<div className="flex gap-2">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								variant="outline"
								className="gap-2 bg-white hover:bg-slate-50 border-slate-200"
							>
								<Printer className="h-4 w-4" /> Print
							</Button>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
								<Download className="h-4 w-4" /> Download Report
							</Button>
						</motion.div>
					</div>
				</motion.div>

				{/* Main Risk Status Card */}
				<motion.div variants={itemVariants}>
					<Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 rounded-3xl">
						<div className="grid md:grid-cols-[320px_1fr]">
							{/* Status Column */}
							<div
								className={`${mainStyles.bg} flex flex-col items-center justify-center p-10 border-r ${mainStyles.border} relative overflow-hidden`}
							>
								{/* Decorative Background Blob */}
								<div
									className={`absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white to-transparent`}
								/>

								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.3, type: "spring" }}
									className={`relative z-10 rounded-full bg-white p-6 shadow-sm mb-6 ${mainStyles.icon} ring-8 ${mainStyles.ring}`}
								>
									<motion.div
										animate={{ scale: [1, 1.05, 1] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									>
										{getIcon("", riskRecommendation.icon)}
									</motion.div>
								</motion.div>

								<Badge
									variant="outline"
									className={`${mainStyles.badge} px-4 py-1.5 border font-bold tracking-wide uppercase shadow-sm relative z-10`}
								>
									STATUS: {predictionResult.status}
								</Badge>
							</div>

							{/* Content Column */}
							<div className="p-8 md:p-12 flex flex-col justify-center bg-white relative">
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
								>
									<h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
										{riskRecommendation.title}
									</h2>
									<p className="text-lg text-slate-600 leading-relaxed mb-8">
										{riskRecommendation.message}
									</p>
								</motion.div>

								<div className="flex items-center gap-4 pt-8 border-t border-slate-100">
									<div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
										<Activity className="h-6 w-6" />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
											Health Score
										</span>
										<span className="text-slate-900 font-extrabold text-3xl tabular-nums leading-none">
											<AnimatedCounter
												value={riskRecommendation.score}
											/>
											<span className="text-lg text-slate-400 font-medium ml-1">
												/100
											</span>
										</span>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</motion.div>

				{/* Recommendations Grid */}
				<motion.div variants={itemVariants}>
					<h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
						<UserPlus className="h-5 w-5 text-blue-500" />
						Your Personal Recommendations
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{recommendations.map((rec: any, index: number) => {
							const styles = getStatusStyles(
								rec.status,
								rec.color,
							);

							return (
								<motion.div
									key={index}
									variants={itemVariants}
									whileHover="hover"
									initial="hidden"
									animate="visible"
									layoutId={`card-${index}`}
								>
									<motion.div
										variants={cardHoverVariants}
										// ADD THESE CLASSES HERE
										className="rounded-2xl overflow-hidden isolation-auto"
									>
										<Card className="relative isolate flex flex-col h-full border-slate-200 shadow-sm transition-colors rounded-2xl overflow-hidden group">
											<CardHeader className="pb-4 pt-6 px-6">
												<div className="flex items-start gap-4">
													<div
														className={`w-12 h-12 rounded-2xl ${styles.bg} flex items-center justify-center shrink-0 border ${styles.border}`}
													>
														{getIcon(rec.category)}
													</div>
													<div className="space-y-1">
														<Badge
															variant="secondary"
															className="mb-2 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500"
														>
															{rec.category}
														</Badge>
														<CardTitle className="text-lg font-bold text-slate-900 leading-tight">
															{rec.title}
														</CardTitle>
													</div>
												</div>
											</CardHeader>

											<CardContent className="flex-1 px-6 pb-2">
												<p className="text-slate-600 text-sm leading-relaxed">
													{rec.message}
												</p>
											</CardContent>

											{/* Note: The footer's border-t and background are now safely clipped by the parent */}
											<CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 mt-4 bg-slate-50/30">
												<Button
													variant="link"
													className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800 gap-1 group-hover:gap-2 transition-all"
												>
													View Guide{" "}
													<ArrowRight className="h-3 w-3" />
												</Button>
											</CardFooter>
										</Card>
									</motion.div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>

				{/* Footer */}
				<motion.div variants={itemVariants}>
					<div className="bg-white border border-slate-200 border-dashed rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
						<div className="flex gap-4 items-center">
							<div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
								<Info className="h-5 w-5" />
							</div>
							<div>
								<h4 className="text-lg font-bold text-slate-900">
									Need a second opinion?
								</h4>
								<p className="text-slate-500 text-sm">
									Consult with a professional counselor or
									nurse.
								</p>
							</div>
						</div>
						<div className="flex flex-wrap gap-3 justify-center">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									variant="outline"
									className="bg-white gap-2 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
								>
									<RefreshCcw className="h-4 w-4" /> Retake
									Assessment
								</Button>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button className="gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-sm">
									<UserPlus className="h-4 w-4" /> Find a
									Specialist
								</Button>
							</motion.div>
						</div>
					</div>

					<motion.p
						className="text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed pt-8 pb-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1 }}
					>
						Disclaimer: This assessment is an AI-powered prediction
						and does not constitute a medical diagnosis.
					</motion.p>
				</motion.div>
			</motion.div>
		</div>
	);
}
