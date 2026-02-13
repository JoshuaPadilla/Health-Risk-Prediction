import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePredictionStore } from "@/stores/prediction_store";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { motion, useSpring, useTransform, type Variants } from "framer-motion";
import {
	Activity,
	AlertTriangle,
	BrainCircuit,
	CheckCircle2,
	Download,
	HeartPulse,
	Info,
	Moon,
	RefreshCcw,
	Scale,
	Share2,
	ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";

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
	// Large Status Icons
	if (iconName === "shield-check")
		return <ShieldCheck className="h-20 w-20" />;
	if (iconName === "alert-triangle")
		return <AlertTriangle className="h-20 w-20" />;
	if (iconName === "check-circle")
		return <CheckCircle2 className="h-20 w-20" />;

	// Category Icons
	switch (category) {
		case "Sleep Health":
			return <Moon className="h-5 w-5 text-indigo-300" />;
		case "Mental Wellness":
			return <Activity className="h-5 w-5 text-pink-300" />;
		case "Physical Health":
			return <Scale className="h-5 w-5 text-orange-300" />;
		case "Lifestyle":
			return <HeartPulse className="h-5 w-5 text-emerald-300" />;
		default:
			return <Info className="h-5 w-5 text-blue-300" />;
	}
};

const getStatusStyles = (status: string, color?: string) => {
	const isSuccess = status === "success" || color === "green";
	const isWarning = status === "warning" || color === "yellow";
	const isDanger = status === "danger" || color === "red";

	if (isSuccess)
		return {
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/30",
			text: "text-emerald-100",
			badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
			icon: "text-emerald-400",
			gradient: "from-emerald-950/80 via-emerald-900/40 to-slate-900/90",
			glow: "shadow-[0_0_80px_-20px_rgba(16,185,129,0.3)]",
			stroke: "#10b981",
		};
	if (isWarning)
		return {
			bg: "bg-amber-500/10",
			border: "border-amber-500/30",
			text: "text-amber-100",
			badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
			icon: "text-amber-400",
			gradient: "from-amber-950/80 via-amber-900/40 to-slate-900/90",
			glow: "shadow-[0_0_80px_-20px_rgba(245,158,11,0.3)]",
			stroke: "#f59e0b",
		};
	if (isDanger)
		return {
			bg: "bg-rose-500/10",
			border: "border-rose-500/30",
			text: "text-rose-100",
			badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
			icon: "text-rose-400",
			gradient: "from-rose-950/80 via-rose-900/40 to-slate-900/90",
			glow: "shadow-[0_0_80px_-20px_rgba(244,63,94,0.3)]",
			stroke: "#f43f5e",
		};
	return {
		bg: "bg-slate-800/50",
		border: "border-slate-700",
		text: "text-slate-100",
		badge: "bg-slate-700 text-slate-300 border-slate-600",
		icon: "text-slate-400",
		gradient: "from-slate-800 to-slate-900",
		glow: "shadow-none",
		stroke: "#94a3b8",
	};
};

// --- Radial Progress Component ---
function RadialProgress({ value, color }: { value: number; color: string }) {
	const radius = 36;
	const circumference = 2 * Math.PI * radius;
	const spring = useSpring(0, { bounce: 0, duration: 2000 });
	const dashOffset = useTransform(
		spring,
		(val) => circumference - (val / 100) * circumference,
	);
	const display = useTransform(spring, (current) => Math.round(current));

	useEffect(() => {
		spring.set(value);
	}, [spring, value]);

	return (
		<div className="relative flex items-center justify-center">
			{/* Background Circle */}
			<svg className="transform -rotate-90 w-32 h-32">
				<circle
					cx="64"
					cy="64"
					r={radius}
					stroke="currentColor"
					strokeWidth="8"
					fill="transparent"
					className="text-slate-800"
				/>
				{/* Foreground Circle */}
				<motion.circle
					cx="64"
					cy="64"
					r={radius}
					stroke={color}
					strokeWidth="8"
					fill="transparent"
					strokeLinecap="round"
					style={{
						strokeDasharray: circumference,
						strokeDashoffset: dashOffset,
					}}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<motion.span className="text-3xl font-black text-white tracking-tighter">
					{display}
				</motion.span>
				<span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
					Score
				</span>
			</div>
		</div>
	);
}

// --- Animation Variants ---
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
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

function RouteComponent() {
	const { predictionResult } = usePredictionStore();
	const navigate = useNavigate();

	if (!predictionResult) return null;

	const { riskRecommendation, recommendations } = predictionResult;
	const mainStyles = getStatusStyles(riskRecommendation.status);

	return (
		<div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans pb-20 relative overflow-hidden">
			<div className="relative z-10 pt-10 pb-24 px-4 md:px-10">
				<div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="flex items-center gap-3 mb-2">
							<Badge
								variant="outline"
								className="border-teal-500/30 bg-teal-500/10 text-teal-400 px-3 py-1 uppercase text-[10px] tracking-widest font-bold"
							>
								AI Analysis Complete
							</Badge>
						</div>

						<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 pb-2">
							Your Health Profile
						</h1>
					</motion.div>

					<motion.div
						className="flex gap-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<Button
							variant="ghost"
							className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full w-10 h-10 p-0"
						>
							<Share2 className="h-5 w-5" />
						</Button>
						<Button className="bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-full px-6 transition-all hover:scale-105 active:scale-95">
							<Download className="h-4 w-4 mr-2" /> Download PDF
						</Button>
					</motion.div>
				</div>
			</div>

			{/* --- Main Content --- */}
			<motion.div
				className="max-w-5xl mx-auto px-4 md:px-6 -mt-10 relative z-20 space-y-10"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* --- Hero Risk Score Card --- */}
				<motion.div variants={itemVariants} className="relative group">
					{/* Glow effect behind card */}
					<div
						className={`absolute -inset-1 rounded-[2.5rem] blur-xl opacity-50 transition duration-1000 group-hover:opacity-75 ${mainStyles.gradient}`}
					/>

					<Card
						className={`relative overflow-hidden border-0 rounded-[2rem] bg-slate-900/60 backdrop-blur-xl ${mainStyles.glow}`}
					>
						{/* Internal Gradient Border via CSS tricks or wrapper. Using simple border for now but styled high-end */}
						<div
							className={`absolute inset-0 rounded-[2rem] border ${mainStyles.border} pointer-events-none`}
						/>

						<div className="grid md:grid-cols-[1.2fr_1.8fr]">
							{/* Left: Visual Status (Gradient Background) */}
							<div
								className={`relative p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br ${mainStyles.gradient}`}
							>
								{/* Noise Texture Overlay */}
								<div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

								<div className="relative z-10 flex flex-col items-center">
									<motion.div
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{
											type: "spring",
											delay: 0.4,
										}}
										className={`rounded-full p-6 bg-slate-950/30 backdrop-blur-md shadow-2xl mb-6 ring-1 ring-white/10`}
									>
										{getIcon("", riskRecommendation.icon)}
									</motion.div>

									<h3 className="text-white text-lg font-semibold tracking-wide mb-1">
										Overall Risk Status
									</h3>
									<Badge
										className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border shadow-lg ${mainStyles.badge}`}
									>
										{predictionResult.status} Level
									</Badge>
								</div>
							</div>

							{/* Right: Detailed Scoring */}
							<div className="p-8 md:p-12 bg-slate-900/40 flex flex-col justify-between">
								<div>
									<div className="flex justify-between items-start mb-6">
										<div>
											<h2 className="text-3xl font-bold text-white mb-2">
												{riskRecommendation.title}
											</h2>
											<p className="text-slate-400 leading-relaxed text-sm md:text-base">
												{riskRecommendation.message}
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-8 pt-8 border-t border-slate-800/60">
									{/* Radial Progress Chart */}
									<div className="shrink-0">
										<RadialProgress
											value={riskRecommendation.score}
											color={mainStyles.stroke}
										/>
									</div>

									<div className="space-y-3 grow">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-xl bg-slate-800/50 flex items-center justify-center border border-slate-700">
												<BrainCircuit className="h-5 w-5 text-teal-400" />
											</div>
											<div>
												<p className="text-xs text-slate-500 font-bold uppercase">
													Model Confidence
												</p>
												<p className="text-white font-medium">
													98.5% Accuracy
												</p>
											</div>
										</div>
										<div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: "98.5%" }}
												transition={{
													duration: 1.5,
													delay: 0.5,
												}}
												className="h-full bg-teal-500 rounded-full"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</motion.div>

				{/* --- Recommendations Grid --- */}
				<motion.div variants={itemVariants}>
					<div className="flex items-center gap-3 mb-6 px-2">
						<div className="h-8 w-1 bg-teal-500 rounded-full" />
						<h3 className="text-xl font-bold text-white">
							Personalized Insights
						</h3>
					</div>

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
									whileHover={{ y: -5 }}
									custom={index}
								>
									<Card className="h-full border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:bg-slate-800/60 transition-colors duration-300 rounded-3xl overflow-hidden group">
										<CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
											<div
												className={`p-3 rounded-2xl ${styles.bg} border ${styles.border}`}
											>
												{getIcon(rec.category)}
											</div>
											<div className="space-y-1">
												<Badge
													variant="outline"
													className="border-slate-700 text-slate-400 text-[10px] uppercase font-bold tracking-wider"
												>
													{rec.category}
												</Badge>
												<CardTitle className="text-lg font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
													{rec.title}
												</CardTitle>
											</div>
										</CardHeader>

										<CardContent>
											<p className="text-slate-400 text-sm leading-relaxed">
												{rec.message}
											</p>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</motion.div>

				{/* --- Disclaimer / Footer --- */}
				<motion.div variants={itemVariants} className="pb-10">
					<div className="rounded-3xl p-1 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
						<div className="bg-[#0F172A] rounded-[22px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
							<div className="flex items-center gap-4 max-w-lg">
								<div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
									<Info className="h-5 w-5" />
								</div>
								<p className="text-slate-500 text-xs leading-relaxed">
									<span className="font-bold text-slate-300 block mb-1">
										Medical Disclaimer
									</span>
									This assessment is generated by AI and is
									for informational purposes only. It is not a
									substitute for professional medical advice,
									diagnosis, or treatment.
								</p>
							</div>
							<Button
								variant="outline"
								onClick={() => navigate({ to: "/predict" })}
								className="whitespace-nowrap border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full"
							>
								<RefreshCcw className="h-4 w-4 mr-2" /> Start
								New Assessment
							</Button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
