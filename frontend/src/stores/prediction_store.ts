import { BaseUrl } from "@/lib/base_url";
import type { PredictionForm } from "@/types/prediction_form";
import { create } from "zustand";

type StoreProps = {
	sendPrediction: (form: PredictionForm) => Promise<any>;
};

export const usePredictionStore = create<StoreProps>(() => ({
	sendPrediction: async (form) => {
		const res = await fetch(`${BaseUrl}prediction/predict`, {
			method: "POST",
			body: JSON.stringify(form),
			headers: {
				"Content-type": "application/json",
			},
		});

		const data = await res.json();
		console.log("Data result:", data);
		return data;
	},
}));
