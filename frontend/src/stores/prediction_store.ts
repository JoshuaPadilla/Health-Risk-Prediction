import { BaseUrl } from "@/lib/base_url";
import type { PredictionForm } from "@/types/prediction_form";
import type { PredictionResult } from "@/types/prediction_result.type";
import { create } from "zustand";

type StoreProps = {
	isLoading: boolean;
	predictionResult: PredictionResult | null;
	sendPrediction: (form: PredictionForm) => Promise<void>;
};

export const usePredictionStore = create<StoreProps>((set) => ({
	isLoading: false,
	predictionResult: null,
	sendPrediction: async (form) => {
		try {
			set({ isLoading: true });
			const [res] = await Promise.all([
				fetch(`${BaseUrl}prediction/predict`, {
					method: "POST",
					body: JSON.stringify(form),
					headers: {
						"Content-type": "application/json",
					},
				}),
				new Promise((resolve) => setTimeout(resolve, 2500)),
			]);

			const data = await res.json();

			if (res.status === 202 && data) {
				set({ predictionResult: data });
			}
		} catch (error) {
			console.log(error);
		} finally {
			set({ isLoading: false });
		}
	},
}));
