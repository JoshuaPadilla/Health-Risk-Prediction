import { PredictionLoading } from "@/components/custom_components/prediction_loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { validatePredictionForm } from "@/helpers/form_validatation";
import { cn } from "@/lib/utils";
import { Assessment_Steps } from "@/static_data/assessment_steps";
import { Bmi_Category } from "@/static_data/bmi_category_options";
import { GenderOptions } from "@/static_data/gender_options";
import { usePredictionStore } from "@/stores/prediction_store";
import type { PredictionForm } from "@/types/prediction_form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
	Activity,
	ArrowLeft,
	ArrowRight,
	Binary,
	Calculator,
	Check,
	Cpu,
	Footprints,
	HeartPulse,
	Lock,
	Moon,
	Network,
	Ruler,
	Sparkles,
	Timer,
	Trees,
	Weight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/predict/")({
	component: RouteComponent,
});

// --- Animation Variants ---
const slideVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 30 : -30,
		opacity: 0,
	}),
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		zIndex: 0,
		x: direction < 0 ? 30 : -30,
		opacity: 0,
	}),
};

function RouteComponent() {
	const navigate = useNavigate();
	const { sendPrediction, isLoading } = usePredictionStore();
	const [step, setStep] = useState(1);
	const [direction, setDirection] = useState(0);
	const totalSteps = 4;

	// State to hold the raw BMI number for display purposes
	const [calculatedBmi, setCalculatedBmi] = useState<number | null>(null);

	const [formData, setFormData] = useState<PredictionForm>({
		gender: 0,
		age: 0,
		height: 0,
		weight: 0,
		sleep_duration: 0,
		physical_activity: 0,
		daily_steps: 0,
		stress_level: 0,
		quality_of_sleep: 0,
		bmi_category: 0,
		heart_rate: 0,
		systolic_bp: 0,
		diastolic_bp: 0,
		model: "forest",
	});

	const updateField = (
		field: keyof PredictionForm,
		value: string | number,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]:
				field === "model"
					? value
					: typeof value === "string" && value !== ""
						? Number(value)
						: value,
		}));
	};

	// --- AUTOMATIC BMI CALCULATION ---
	useEffect(() => {
		const { weight, height } = formData;

		// Only calculate if valid numbers are present
		if (weight > 0 && height > 0) {
			// Convert height from cm to meters
			const heightInMeters = height / 100;

			// Calculate BMI: kg / m^2
			const bmiValue = weight / (heightInMeters * heightInMeters);
			setCalculatedBmi(Number(bmiValue.toFixed(1)));

			let categoryIndex = 0;

			// Determine Category based on standard BMI ranges
			// Ensure these indices match your Bmi_Category options values
			if (bmiValue < 18.5) {
				categoryIndex = 0; // Underweight
			} else if (bmiValue >= 18.5 && bmiValue < 25) {
				categoryIndex = 1; // Normal
			} else if (bmiValue >= 25 && bmiValue < 30) {
				categoryIndex = 2; // Overweight
			} else {
				categoryIndex = 3; // Obese
			}

			// Update formData if the category has changed
			if (formData.bmi_category !== categoryIndex) {
				updateField("bmi_category", categoryIndex);
			}
		}
	}, [formData.weight, formData.height]); // Dependencies: runs when weight or height changes

	const nextStep = () => {
		if (step < totalSteps) {
			setDirection(1);
			setStep((prev) => prev + 1);
		}
	};

	const prevStep = () => {
		if (step > 1) {
			setDirection(-1);
			setStep((prev) => prev - 1);
		}
	};

	const currentStepData = Assessment_Steps[step - 1];

	const handleSubmit = async () => {
		const validation = validatePredictionForm(formData);

		if (!validation.success) {
			validation.errors.forEach((errorMsg) => {
				toast.error("Missing Fields", {
					description: (
						<span className="text-red-400 font-semibold">
							{errorMsg}
						</span>
					),
					duration: 4000,
				});
			});
			return;
		}

		try {
			await sendPrediction(formData);
			navigate({ to: "/predict/result" });
		} catch (error) {
			console.error(error);
			toast.error("Submission Failed");
		}
	};

	return (
		<div className="min-h-screen bg-[#0B1120] font-sans text-slate-900 flex flex-col items-center py-8 px-4 md:px-8 relative overflow-hidden">
			{isLoading && <PredictionLoading />}

			{/* Background Glows */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[120px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
			</div>

			<div className="w-full max-w-5xl space-y-8 relative z-10">
				{/* --- Header Section --- */}
				<div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
					<div>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="inline-flex items-center gap-2 rounded-full bg-slate-800/50 border border-slate-700 px-3 py-1 text-xs font-bold text-teal-400 uppercase tracking-wider mb-3"
						>
							<Sparkles className="h-3 w-3" />
							AI Health Assessment
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
						>
							{currentStepData.title}
						</motion.h1>
					</div>

					{/* Step Progress Indicators */}
					<div className="flex bg-slate-900/50 backdrop-blur-md rounded-full p-1.5 border border-slate-700/50">
						{Assessment_Steps.map((s) => (
							<div key={s.id} className="relative mx-1">
								<motion.div
									className={`h-2 rounded-full transition-colors duration-500 ${
										step >= s.id
											? "bg-gradient-to-r from-teal-400 to-blue-500"
											: "bg-slate-700"
									}`}
									animate={{ width: step === s.id ? 40 : 12 }}
								/>
							</div>
						))}
					</div>
				</div>

				{/* --- Main Content Card --- */}
				<Card className="overflow-hidden border-none shadow-2xl shadow-black/50 relative min-h-[600px] flex flex-col bg-white rounded-3xl">
					{/* Hero Image Banner (Compact) */}
					<div className="relative h-32 w-full overflow-hidden shrink-0 bg-slate-900">
						<AnimatePresence mode="wait">
							<motion.img
								key={currentStepData.image}
								src={currentStepData.image}
								alt={currentStepData.title}
								initial={{ opacity: 0, scale: 1.1 }}
								animate={{ opacity: 0.4, scale: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="w-full h-full object-cover absolute inset-0 mix-blend-overlay"
							/>
						</AnimatePresence>
						<div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/40" />

						<div className="absolute inset-0 flex items-center px-8">
							<div className="flex items-center gap-3">
								<div className="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-teal-400">
									<currentStepData.icon className="w-6 h-6" />
								</div>
								<div className="text-white/80 font-medium border-l border-white/20 pl-3">
									Step {step} of {totalSteps}
								</div>
							</div>
						</div>
					</div>

					{/* Scrollable Form Area */}
					<div className="flex-1 overflow-y-auto overflow-x-hidden relative">
						<CardContent className="p-6 md:p-10">
							<AnimatePresence custom={direction} mode="wait">
								<motion.div
									key={step}
									custom={direction}
									variants={slideVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{
										x: {
											type: "spring",
											stiffness: 300,
											damping: 30,
										},
										opacity: { duration: 0.2 },
									}}
									className="w-full h-full"
								>
									{/* STEP 1: DEMOGRAPHICS */}
									{step === 1 && (
										<div className="space-y-8 max-w-3xl mx-auto">
											<div className="space-y-4">
												<Label className="text-base font-bold text-slate-800">
													Biological Sex
												</Label>
												<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
													{GenderOptions.map(
														(item) => (
															<motion.button
																key={item.val}
																whileHover={{
																	scale: 1.02,
																	y: -2,
																}}
																whileTap={{
																	scale: 0.98,
																}}
																onClick={() =>
																	updateField(
																		"gender",
																		item.val,
																	)
																}
																className={cn(
																	"relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
																	formData.gender ===
																		item.val
																		? "border-teal-500 bg-teal-50 text-teal-700 shadow-lg shadow-teal-500/10"
																		: "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50",
																)}
															>
																<item.icon className="w-8 h-8 mb-3" />
																<span className="font-semibold">
																	{item.label}
																</span>
																{formData.gender ===
																	item.val && (
																	<div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white">
																		<Check
																			className="w-3 h-3"
																			strokeWidth={
																				3
																			}
																		/>
																	</div>
																)}
															</motion.button>
														),
													)}
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
												{/* Age Input */}
												<div className="space-y-2 group">
													<Label className="font-semibold group-focus-within:text-teal-600 transition-colors">
														Age
													</Label>
													<div className="relative">
														<Input
															type="number"
															value={
																formData.age ||
																""
															}
															onChange={(e) =>
																updateField(
																	"age",
																	e.target
																		.value,
																)
															}
															className="h-14 pl-4 text-lg bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 transition-all"
															placeholder="0"
														/>
														<span className="absolute right-4 top-4 text-slate-400 text-sm font-medium">
															years
														</span>
													</div>
												</div>

												{/* Height Input */}
												<div className="space-y-2 group">
													<Label className="font-semibold group-focus-within:text-teal-600 transition-colors">
														Height
													</Label>
													<div className="relative">
														<div className="absolute left-4 top-4 bg-slate-200 rounded-md p-0.5">
															<Ruler className="h-5 w-5 text-slate-500" />
														</div>
														<Input
															type="number"
															value={
																formData.height ||
																""
															}
															onChange={(e) =>
																updateField(
																	"height",
																	e.target
																		.value,
																)
															}
															className="h-14 pl-14 text-lg bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 transition-all"
															placeholder="0"
														/>
														<span className="absolute right-4 top-4 text-slate-400 text-sm font-medium">
															cm
														</span>
													</div>
												</div>

												{/* Weight Input */}
												<div className="space-y-2 group">
													<Label className="font-semibold group-focus-within:text-teal-600 transition-colors">
														Weight
													</Label>
													<div className="relative">
														<div className="absolute left-4 top-4 bg-slate-200 rounded-md p-0.5">
															<Weight className="h-5 w-5 text-slate-500" />
														</div>
														<Input
															type="number"
															value={
																formData.weight ||
																""
															}
															onChange={(e) =>
																updateField(
																	"weight",
																	e.target
																		.value,
																)
															}
															className="h-14 pl-14 text-lg bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 transition-all"
															placeholder="0"
														/>
														<span className="absolute right-4 top-4 text-slate-400 text-sm font-medium">
															kg
														</span>
													</div>
												</div>
											</div>
										</div>
									)}

									{/* STEP 2: LIFESTYLE */}
									{step === 2 && (
										<div className="space-y-8 max-w-3xl mx-auto">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
												<div className="space-y-2 group">
													<Label className="font-semibold group-focus-within:text-purple-600 transition-colors">
														Sleep Duration
													</Label>
													<div className="relative">
														<Moon className="absolute left-4 top-4 h-6 w-6 text-purple-400" />
														<Input
															type="number"
															step="0.5"
															value={
																formData.sleep_duration
															}
															onChange={(e) =>
																updateField(
																	"sleep_duration",
																	e.target
																		.value,
																)
															}
															className="h-14 pl-12 text-lg focus:ring-purple-500/20 focus:border-purple-500 bg-slate-50 border-slate-200"
														/>
														<span className="absolute right-4 top-4 text-slate-400 text-sm font-medium">
															hours
														</span>
													</div>
												</div>

												<div className="space-y-2 group">
													<Label className="font-semibold group-focus-within:text-orange-600 transition-colors">
														Physical Activity
													</Label>
													<div className="relative">
														<Timer className="absolute left-4 top-4 h-6 w-6 text-orange-400" />
														<Input
															type="number"
															value={
																formData.physical_activity ||
																""
															}
															onChange={(e) =>
																updateField(
																	"physical_activity",
																	e.target
																		.value,
																)
															}
															className="h-14 pl-12 text-lg focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 border-slate-200"
														/>
														<span className="absolute right-4 top-4 text-slate-400 text-sm font-medium">
															mins/day
														</span>
													</div>
												</div>

												<div className="md:col-span-2 space-y-2 group">
													<Label className="font-semibold group-focus-within:text-emerald-600 transition-colors">
														Daily Steps (Avg)
													</Label>
													<div className="relative">
														<Footprints className="absolute left-4 top-4 h-6 w-6 text-emerald-400" />
														<Input
															type="number"
															value={
																formData.daily_steps ||
																""
															}
															onChange={(e) =>
																updateField(
																	"daily_steps",
																	e.target
																		.value,
																)
															}
															className="h-14 pl-12 text-lg focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 border-slate-200"
															placeholder="e.g. 8000"
														/>
													</div>
												</div>
											</div>

											<div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6">
												<div className="flex justify-between items-center">
													<Label className="text-lg font-bold text-slate-700">
														Perceived Stress Level
													</Label>
													<div className="flex items-center gap-3">
														<span className="font-bold text-3xl text-teal-600">
															{
																formData.stress_level
															}
														</span>
														<span className="text-sm text-slate-400 font-bold uppercase">
															/ 10
														</span>
													</div>
												</div>
												<div className="px-2">
													<Slider
														value={[
															formData.stress_level,
														]}
														onValueChange={(vals) =>
															updateField(
																"stress_level",
																vals[0],
															)
														}
														max={10}
														step={1}
														className="py-4"
													/>
													<div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
														<span>Low</span>
														<span>Moderate</span>
														<span>High</span>
													</div>
												</div>
											</div>
										</div>
									)}

									{/* STEP 3: HEALTH STATUS */}
									{step === 3 && (
										<div className="space-y-8 max-w-3xl mx-auto">
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<Label className="text-base font-bold text-slate-900">
														BMI Category
													</Label>
													{calculatedBmi !== null &&
														calculatedBmi > 0 && (
															<div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
																<Calculator className="w-3 h-3 text-slate-400" />
																<span className="text-xs text-slate-500 font-medium">
																	Calculated
																	BMI:{" "}
																	<span className="text-slate-900 font-bold">
																		{
																			calculatedBmi
																		}
																	</span>
																</span>
															</div>
														)}
												</div>

												{/* BMI Category Selection - Disabled/ReadOnly */}
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
													{/* Overlay to reinforce it is not clickable, though buttons are visually disabled */}
													<div className="absolute inset-0 z-20 cursor-not-allowed" />

													{Bmi_Category.map(
														(item) => (
															<motion.div
																key={item.val}
																className={cn(
																	"text-left p-4 rounded-xl border transition-all duration-200 relative pointer-events-none",
																	formData.bmi_category ===
																		item.val
																		? "border-teal-500 bg-teal-50/80 ring-1 ring-teal-500 shadow-md z-10 opacity-100"
																		: "border-slate-100 bg-slate-50/50 opacity-60 grayscale-[0.5]",
																)}
															>
																<div className="font-bold text-slate-900 mb-1">
																	{item.label}
																</div>
																<div className="text-xs text-slate-500 leading-tight">
																	{item.desc}
																</div>
																{formData.bmi_category ===
																	item.val && (
																	<div className="absolute top-3 right-3 text-teal-600 flex gap-1 items-center bg-white/50 rounded-full px-1.5 py-0.5 border border-teal-200/50">
																		<Lock className="w-3 h-3" />
																		<span className="text-[10px] font-bold uppercase">
																			Auto
																		</span>
																	</div>
																)}
															</motion.div>
														),
													)}
												</div>
												{(!formData.weight ||
													!formData.height) && (
													<p className="text-xs text-red-400 font-medium mt-2">
														* Please define Height
														and Weight in Step 1 to
														calculate BMI.
													</p>
												)}
											</div>

											<div className="space-y-4">
												<Label className="text-base font-bold">
													Quality of Sleep (1-10)
												</Label>
												<div className="flex flex-wrap gap-2 justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
													{[
														1, 2, 3, 4, 5, 6, 7, 8,
														9, 10,
													].map((num) => (
														<motion.button
															key={num}
															whileHover={{
																scale: 1.1,
															}}
															whileTap={{
																scale: 0.9,
															}}
															onClick={() =>
																updateField(
																	"quality_of_sleep",
																	num,
																)
															}
															className={cn(
																"h-10 w-10 md:h-12 md:w-12 rounded-lg border text-sm md:text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600",
																formData.quality_of_sleep ===
																	num
																	? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30"
																	: "bg-white text-slate-600 border-slate-200 hover:border-blue-300",
															)}
														>
															{num}
														</motion.button>
													))}
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
												<div className="md:col-span-2 space-y-2">
													<Label className="font-bold">
														Resting Heart Rate
													</Label>
													<div className="relative">
														<Activity className="absolute left-4 top-4 h-6 w-6 text-rose-500" />
														<Input
															type="number"
															value={
																formData.heart_rate ||
																""
															}
															onChange={(e) =>
																updateField(
																	"heart_rate",
																	e.target
																		.value,
																)
															}
															className="h-14 pl-12 text-lg font-bold focus:border-rose-500 focus:ring-rose-500/20 bg-slate-50 border-slate-200"
															placeholder="e.g. 72"
														/>
														<span className="absolute right-4 top-4 text-slate-400 text-sm font-medium">
															bpm
														</span>
													</div>
												</div>

												<div className="md:col-span-3 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 relative overflow-hidden">
													<HeartPulse className="absolute -right-6 -bottom-6 w-32 h-32 text-blue-200/50 -rotate-12 pointer-events-none" />
													<Label className="text-blue-900 mb-4 block font-bold">
														Blood Pressure
													</Label>
													<div className="flex items-center gap-4 relative z-10">
														<div className="flex-1 space-y-1.5">
															<Label className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
																Systolic
															</Label>
															<Input
																type="number"
																value={
																	formData.systolic_bp ||
																	""
																}
																onChange={(e) =>
																	updateField(
																		"systolic_bp",
																		e.target
																			.value,
																	)
																}
																className="h-12 bg-white border-blue-200 focus:border-blue-500 text-center font-bold text-lg"
																placeholder="120"
															/>
														</div>
														<span className="text-3xl text-blue-300 font-light pt-6">
															/
														</span>
														<div className="flex-1 space-y-1.5">
															<Label className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
																Diastolic
															</Label>
															<Input
																type="number"
																value={
																	formData.diastolic_bp ||
																	""
																}
																onChange={(e) =>
																	updateField(
																		"diastolic_bp",
																		e.target
																			.value,
																	)
																}
																className="h-12 bg-white border-blue-200 focus:border-blue-500 text-center font-bold text-lg"
																placeholder="80"
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}

									{/* STEP 4: MODEL SELECTION */}
									{step === 4 && (
										<div className="space-y-6 max-w-3xl mx-auto">
											<div className="text-center md:text-left">
												<h3 className="text-xl font-bold text-slate-900">
													Select Prediction Model
												</h3>
												<p className="text-slate-500">
													Choose the machine learning
													algorithm to process your
													health data.
												</p>
											</div>

											<div className="grid grid-cols-1 gap-4 mt-4">
												{[
													{
														id: "forest",
														label: "Random Forest",
														desc: "High accuracy ensemble method using multiple decision trees. Best for complex datasets.",
														icon: Trees,
														color: "text-emerald-600",
														bg: "bg-emerald-50",
														border: "border-emerald-200",
														activeBorder:
															"border-emerald-500",
														activeBg:
															"bg-emerald-50/50",
													},
													{
														id: "svm",
														label: "Support Vector Machine",
														desc: "Robust classification algorithm effective in high-dimensional spaces.",
														icon: Network,
														color: "text-purple-600",
														bg: "bg-purple-50",
														border: "border-purple-200",
														activeBorder:
															"border-purple-500",
														activeBg:
															"bg-purple-50/50",
													},
													{
														id: "logistic",
														label: "Logistic Regression",
														desc: "Statistical model used for binary classification. Fast and interpretable.",
														icon: Binary,
														color: "text-blue-600",
														bg: "bg-blue-50",
														border: "border-blue-200",
														activeBorder:
															"border-blue-500",
														activeBg:
															"bg-blue-50/50",
													},
												].map((model) => (
													<motion.div
														key={model.id}
														whileHover={{
															scale: 1.01,
															y: -2,
														}}
														whileTap={{
															scale: 0.99,
														}}
														onClick={() =>
															updateField(
																"model",
																model.id,
															)
														}
														className={cn(
															"cursor-pointer relative flex items-start gap-5 p-6 rounded-2xl border-2 transition-all duration-300",
															formData.model ===
																model.id
																? cn(
																		model.activeBorder,
																		model.activeBg,
																		"shadow-lg",
																	)
																: "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md",
														)}
													>
														<div
															className={cn(
																"p-4 rounded-xl shrink-0 shadow-sm",
																model.bg,
															)}
														>
															<model.icon
																className={cn(
																	"w-7 h-7",
																	model.color,
																)}
															/>
														</div>
														<div className="flex-1 py-0.5">
															<div className="flex items-center justify-between">
																<h3 className="font-bold text-lg text-slate-900">
																	{
																		model.label
																	}
																</h3>
																{formData.model ===
																	model.id && (
																	<motion.span
																		initial={{
																			scale: 0,
																		}}
																		animate={{
																			scale: 1,
																		}}
																		className={cn(
																			"text-xs font-bold px-2 py-1 rounded-full bg-white border",
																			model.color,
																			model.border,
																		)}
																	>
																		SELECTED
																	</motion.span>
																)}
															</div>
															<p className="text-slate-500 mt-2 leading-relaxed text-sm">
																{model.desc}
															</p>
														</div>
													</motion.div>
												))}
											</div>
										</div>
									)}
								</motion.div>
							</AnimatePresence>
						</CardContent>
					</div>

					{/* Footer Controls */}
					<div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0 z-10 rounded-b-3xl">
						<Button
							variant="ghost"
							size="lg"
							onClick={prevStep}
							disabled={step === 1}
							className={cn(
								"text-slate-500 hover:text-slate-900 hover:bg-slate-200 font-bold transition-opacity",
								step === 1
									? "opacity-0 pointer-events-none"
									: "opacity-100",
							)}
						>
							<ArrowLeft className="w-5 h-5 mr-2" /> Back
						</Button>

						{step < totalSteps ? (
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									onClick={nextStep}
									size="lg"
									className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-12 text-base font-bold shadow-lg shadow-slate-900/20 group"
								>
									Continue
									<ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
								</Button>
							</motion.div>
						) : (
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									onClick={handleSubmit}
									size="lg"
									className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-full px-10 h-12 text-base font-bold shadow-lg shadow-blue-500/30"
								>
									Start Prediction
									<Cpu className="w-5 h-5 ml-2 animate-pulse" />
								</Button>
							</motion.div>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
