import { Activity, Brain, ScanLine, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

// The steps simulate a complex medical analysis process
const LOADING_STEPS = [
	{ icon: ScanLine, label: "Scanning health data..." },
	{ icon: Brain, label: "Running prediction model..." },
	{ icon: Stethoscope, label: "Generating health insights..." },
];

export function PredictionLoading() {
	const [stepIndex, setStepIndex] = useState(0);

	// Cycle through the loading messages every 800ms
	useEffect(() => {
		const interval = setInterval(() => {
			setStepIndex((prev) => {
				// If we haven't reached the last step, go to next.
				// If we HAVE reached the last step, stay there (return prev).
				if (prev < LOADING_STEPS.length - 1) {
					return prev + 1;
				}
				return prev;
			});
		}, 800); // Increased to 1000ms to make it feel a bit more "deliberate"
		return () => clearInterval(interval);
	}, []);

	const CurrentIcon = LOADING_STEPS[stepIndex].icon;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[4px] animate-in fade-in duration-300">
			{/* Central Card */}
			<div className="relative bg-white w-full max-w-sm mx-4 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center overflow-hidden">
				{/* Background decorative gradients (Medical Blue/Teal) */}
				<div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60" />
				<div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-60" />

				{/* 1. The "Heartbeat" Animation Centerpiece */}
				<div className="relative mb-8 mt-2">
					{/* Outer Ring - Ping Effect */}
					<div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping" />

					{/* Middle Ring - Pulse Effect */}
					<div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-pulse delay-75" />

					{/* Icon Container */}
					<div className="relative bg-gradient-to-tr from-blue-50 to-white p-5 rounded-full shadow-lg ring-1 ring-blue-100">
						<Activity className="w-10 h-10 text-blue-600 animate-pulse" />
					</div>

					{/* Orbiting Spinner */}
					<div className="absolute -inset-3 border-t-2 border-r-2 border-blue-500/30 rounded-full animate-spin duration-[3s]" />
				</div>

				{/* 2. Text Content */}
				<div className="space-y-2 z-10 w-full">
					<h3 className="text-xl font-bold text-slate-900 tracking-tight">
						Analyzing Health Profile
					</h3>

					{/* Dynamic Step Text with Icon */}
					<div className="h-6 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
						<CurrentIcon className="w-4 h-4 text-blue-500 animate-bounce" />
						<span className="animate-in fade-in slide-in-from-bottom-2 duration-300 key-{stepIndex}">
							{LOADING_STEPS[stepIndex].label}
						</span>
					</div>
				</div>

				{/* 3. Indeterminate Progress Bar */}
				<div className="w-full bg-slate-100 h-1.5 rounded-full mt-8 overflow-hidden relative">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2 h-full -translate-x-full animate-[shimmer_1.5s_infinite]" />
				</div>
			</div>

			{/* Custom Keyframe for the sliding bar */}
			<style>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
      `}</style>
		</div>
	);
}
