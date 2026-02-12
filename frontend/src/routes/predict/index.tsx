import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	Activity,
	Moon,
	Check,
	Ruler,
	Weight,
	Timer,
	Cpu,
	Network,
	Binary,
	Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { GenderOptions } from "@/static_data/gender_options";
import { Bmi_Category } from "@/static_data/bmi_category_options";
import { Assessment_Steps } from "@/static_data/assessment_steps";
import { toast } from "sonner";
import { validatePredictionForm } from "@/helpers/form_validatation";
import { usePredictionStore } from "@/stores/prediction_store";
import type { PredictionForm } from "@/types/prediction_form";
import { PredictionLoading } from "@/components/custom_components/prediction_loading";

export const Route = createFileRoute("/predict/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { sendPrediction, isLoading } = usePredictionStore();
	const [step, setStep] = useState(1);
	const totalSteps = 4; // Increased to 4 to accommodate Model Selection cleanly

	const [formData, setFormData] = useState<PredictionForm>({
		gender: 0,
		age: 24,
		height: 168,
		weight: 82,
		sleep_duration: 5,
		physical_activity: 100,
		daily_steps: 8000,
		stress_level: 8,
		quality_of_sleep: 4,
		bmi_category: 1,
		heart_rate: 75,
		systolic_bp: 120,
		diastolic_bp: 80,
		model: "forest",
	});

	// Helper to handle updates safely
	const updateField = (
		field: keyof PredictionForm,
		value: string | number,
	) => {
		setFormData((prev) => ({
			...prev,
			// If the field is 'model', keep as string. Otherwise, convert strings to numbers.
			[field]:
				field === "model"
					? value
					: typeof value === "string" && value !== ""
						? Number(value)
						: value,
		}));
	};

	const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

	const currentStepData = Assessment_Steps[step - 1];

	const handleSubmit = async () => {
		// 1. Run Validation
		const validation = validatePredictionForm(formData);

		if (!validation.success) {
			// Map through the array of errors and trigger a toast for each one
			validation.errors.forEach((errorMsg) => {
				toast.error("Missing Fields", {
					description: (
						<span className="text-red-400 font-semibold">
							{errorMsg}
						</span>
					),
					// Optional: Make the toast stick around a bit longer if there are many
					duration: 4000,
				});
			});
			return;
		}

		// 2. Submit Data (If valid)
		try {
			// Show loading state
			await sendPrediction(formData); // Simulate API call

			navigate({ to: "/predict/result" });
		} catch (error) {
			console.error(error);
			toast.error("Submission Failed");
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-start font-sans text-slate-900">
			{isLoading && <PredictionLoading />}

			<div className="w-full max-w-3xl space-y-6">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900">
							Health Assessment
						</h1>
						<p className="text-slate-500 text-sm">
							Step {step} of {totalSteps}: {currentStepData.title}
						</p>
					</div>
					<div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
						{Assessment_Steps.map((s) => (
							<div
								key={s.id}
								className={`h-2 w-8 md:w-12 rounded-full mx-1 transition-all duration-500 ${
									step >= s.id
										? "bg-blue-600"
										: "bg-slate-200"
								}`}
							/>
						))}
					</div>
				</div>

				<Card className="overflow-hidden border-slate-200 shadow-xl relative min-h-[600px] flex flex-col bg-white">
					{/* Hero Image Section */}
					<div className="relative h-40 w-full overflow-hidden shrink-0 group">
						<img
							src={currentStepData.image}
							alt={currentStepData.title}
							className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
						<div className="absolute bottom-0 left-0 p-6 text-white animate-in slide-in-from-bottom-2 fade-in duration-500">
							<div className="flex items-center gap-2 mb-1 text-blue-300 font-medium text-xs uppercase tracking-wider">
								<currentStepData.icon className="w-4 h-4" />
								{currentStepData.shortTitle}
							</div>
							<h2 className="text-3xl font-bold">
								{currentStepData.title}
							</h2>
						</div>
					</div>

					<CardContent className="p-8 flex-1">
						{/* STEP 1: DEMOGRAPHICS */}
						{step === 1 && (
							<div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
								<div className="space-y-4">
									<Label className="text-base font-semibold">
										Biological Sex
									</Label>
									<div className="grid grid-cols-3 gap-4">
										{GenderOptions.map((item) => (
											<div
												key={item.val}
												onClick={() =>
													updateField(
														"gender",
														item.val,
													)
												}
												className={cn(
													"cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:bg-slate-50",
													formData.gender === item.val
														? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm"
														: "border-slate-100 text-slate-500 hover:border-slate-300",
												)}
											>
												<item.icon className="w-6 h-6 mb-2" />
												<span className="font-medium text-sm">
													{item.label}
												</span>
												{formData.gender ===
													item.val && (
													<div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
												)}
											</div>
										))}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="space-y-2">
										<Label>Age</Label>
										<div className="relative">
											<Input
												type="number"
												value={formData.age || ""}
												onChange={(e) =>
													updateField(
														"age",
														e.target.value,
													)
												}
												className="h-12 pl-4 text-lg"
												placeholder="0"
											/>
											<span className="absolute right-4 top-3 text-slate-400 text-sm">
												years
											</span>
										</div>
									</div>
									<div className="space-y-2">
										<Label>Height</Label>
										<div className="relative">
											<Ruler className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
											<Input
												type="number"
												value={formData.height || ""}
												onChange={(e) =>
													updateField(
														"height",
														e.target.value,
													)
												}
												className="h-12 pl-10 text-lg"
												placeholder="0"
											/>
											<span className="absolute right-4 top-3 text-slate-400 text-sm">
												cm
											</span>
										</div>
									</div>
									<div className="space-y-2">
										<Label>Weight</Label>
										<div className="relative">
											<Weight className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
											<Input
												type="number"
												value={formData.weight || ""}
												onChange={(e) =>
													updateField(
														"weight",
														e.target.value,
													)
												}
												className="h-12 pl-10 text-lg"
												placeholder="0"
											/>
											<span className="absolute right-4 top-3 text-slate-400 text-sm">
												kg
											</span>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* STEP 2: LIFESTYLE */}
						{step === 2 && (
							<div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label>Sleep Duration</Label>
										<div className="relative">
											<Moon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
											<Input
												type="number"
												step="0.5"
												value={formData.sleep_duration}
												onChange={(e) =>
													updateField(
														"sleep_duration",
														e.target.value,
													)
												}
												className="h-12 pl-10"
											/>
											<span className="absolute right-4 top-3.5 text-slate-400 text-sm">
												hours
											</span>
										</div>
									</div>
									<div className="space-y-2">
										<Label>Physical Activity</Label>
										<div className="relative">
											<Timer className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
											<Input
												type="number"
												value={
													formData.physical_activity ||
													""
												}
												onChange={(e) =>
													updateField(
														"physical_activity",
														e.target.value,
													)
												}
												className="h-12 pl-10"
											/>
											<span className="absolute right-4 top-3.5 text-slate-400 text-sm">
												mins/day
											</span>
										</div>
									</div>
									<div className="md:col-span-2 space-y-2">
										<Label>Daily Steps (Avg)</Label>
										<Input
											type="number"
											value={formData.daily_steps || ""}
											onChange={(e) =>
												updateField(
													"daily_steps",
													e.target.value,
												)
											}
											className="h-12"
											placeholder="e.g. 8000"
										/>
									</div>
								</div>

								<div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
									<div className="flex justify-between items-center">
										<Label className="text-base">
											Perceived Stress Level
										</Label>
										<div className="flex items-center gap-2">
											<span className="text-sm text-slate-400">
												Low
											</span>
											<span className="font-bold text-blue-600 bg-white px-4 py-1 rounded-md shadow-sm border border-blue-100 min-w-[3rem] text-center">
												{formData.stress_level}
											</span>
											<span className="text-sm text-slate-400">
												High
											</span>
										</div>
									</div>
									<Slider
										value={[formData.stress_level]}
										onValueChange={(vals) =>
											updateField("stress_level", vals[0])
										}
										max={10}
										step={1}
										className="py-2"
									/>
								</div>
							</div>
						)}

						{/* STEP 3: HEALTH STATUS */}
						{step === 3 && (
							<div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
								<div className="space-y-3">
									<Label className="text-base font-semibold">
										BMI Category
									</Label>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
										{Bmi_Category.map((item) => (
											<button
												key={item.val}
												onClick={() =>
													updateField(
														"bmi_category",
														item.val,
													)
												}
												className={cn(
													"text-left p-3 rounded-lg border transition-all hover:bg-slate-50 relative",
													formData.bmi_category ===
														item.val
														? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 z-10"
														: "border-slate-200",
												)}
											>
												<div className="font-medium text-slate-900">
													{item.label}
												</div>
												<div className="text-xs text-slate-500 mt-0.5">
													{item.desc}
												</div>
												{formData.bmi_category ===
													item.val && (
													<div className="absolute top-2 right-2 text-blue-600">
														<Check className="w-4 h-4" />
													</div>
												)}
											</button>
										))}
									</div>
								</div>

								<div className="space-y-3">
									<Label>Quality of Sleep (1-10)</Label>
									<div className="flex flex-wrap gap-2 justify-between">
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
											(num) => (
												<button
													key={num}
													onClick={() =>
														updateField(
															"quality_of_sleep",
															num,
														)
													}
													className={cn(
														"h-10 w-10 rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600",
														formData.quality_of_sleep ===
															num
															? "bg-slate-900 text-white border-slate-900"
															: "bg-white text-slate-700 border-slate-200 hover:bg-slate-100",
													)}
												>
													{num}
												</button>
											),
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label>Resting Heart Rate</Label>
										<div className="relative">
											<Activity className="absolute left-3 top-3.5 h-5 w-5 text-red-500" />
											<Input
												type="number"
												value={
													formData.heart_rate || ""
												}
												onChange={(e) =>
													updateField(
														"heart_rate",
														e.target.value,
													)
												}
												className="h-12 pl-10 text-lg font-medium"
												placeholder="e.g. 72"
											/>
											<span className="absolute right-4 top-3.5 text-slate-400 text-sm">
												bpm
											</span>
										</div>
									</div>
								</div>

								<div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
									<Label className="text-blue-900 mb-4 block font-semibold">
										Blood Pressure
									</Label>
									<div className="flex items-center gap-4">
										<div className="flex-1 space-y-1">
											<Label className="text-xs text-blue-700 uppercase">
												Systolic
											</Label>
											<Input
												type="number"
												value={
													formData.systolic_bp || ""
												}
												onChange={(e) =>
													updateField(
														"systolic_bp",
														e.target.value,
													)
												}
												className="h-12 bg-white border-blue-200 focus-visible:ring-blue-500"
												placeholder="120"
											/>
										</div>
										<span className="text-2xl text-blue-300 font-light pt-6">
											/
										</span>
										<div className="flex-1 space-y-1">
											<Label className="text-xs text-blue-700 uppercase">
												Diastolic
											</Label>
											<Input
												type="number"
												value={
													formData.diastolic_bp || ""
												}
												onChange={(e) =>
													updateField(
														"diastolic_bp",
														e.target.value,
													)
												}
												className="h-12 bg-white border-blue-200 focus-visible:ring-blue-500"
												placeholder="80"
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* STEP 4: MODEL SELECTION */}
						{step === 4 && (
							<div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
								<div className="space-y-2">
									<Label className="text-lg font-semibold">
										Select Prediction Model
									</Label>
									<p className="text-sm text-slate-500">
										Choose the machine learning algorithm to
										process your health data.
									</p>
								</div>

								<div className="grid grid-cols-1 gap-4">
									{[
										{
											id: "forest",
											label: "Random Forest",
											desc: "High accuracy ensemble method using multiple decision trees. Best for complex datasets.",
											icon: Trees,
											color: "text-green-600",
											bg: "bg-green-50",
										},
										{
											id: "svm",
											label: "Support Vector Machine",
											desc: "Robust classification algorithm effective in high-dimensional spaces.",
											icon: Network,
											color: "text-purple-600",
											bg: "bg-purple-50",
										},
										{
											id: "logistic",
											label: "Logistic Regression",
											desc: "Statistical model used for binary classification. Fast and interpretable.",
											icon: Binary,
											color: "text-blue-600",
											bg: "bg-blue-50",
										},
									].map((model) => (
										<div
											key={model.id}
											onClick={() =>
												updateField("model", model.id)
											}
											className={cn(
												"cursor-pointer relative flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-300",
												formData.model === model.id
													? "border-slate-900 bg-slate-50 shadow-md"
													: "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
											)}
										>
											<div
												className={cn(
													"p-3 rounded-lg shrink-0",
													model.bg,
												)}
											>
												<model.icon
													className={cn(
														"w-6 h-6",
														model.color,
													)}
												/>
											</div>
											<div className="flex-1">
												<h3 className="font-semibold text-slate-900">
													{model.label}
												</h3>
												<p className="text-sm text-slate-500 mt-1 leading-relaxed">
													{model.desc}
												</p>
											</div>
											<div
												className={cn(
													"w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-1",
													formData.model === model.id
														? "border-slate-900 bg-slate-900"
														: "border-slate-300",
												)}
											>
												{formData.model ===
													model.id && (
													<div className="w-2 h-2 rounded-full bg-white" />
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>

					{/* Footer Controls */}
					<div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
						<Button
							variant="ghost"
							onClick={prevStep}
							disabled={step === 1}
							className="text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
						>
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>

						{step < totalSteps ? (
							<Button
								onClick={nextStep}
								className="bg-slate-900 hover:bg-slate-800 px-8 h-12 text-base transition-all hover:pr-6 group"
							>
								Next Section
								<ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
							</Button>
						) : (
							<Button
								className="bg-blue-600 hover:bg-blue-700 px-8 h-12 text-base shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
								onClick={handleSubmit}
							>
								Start Prediction
								<Cpu className="w-4 h-4 ml-2" />
							</Button>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
