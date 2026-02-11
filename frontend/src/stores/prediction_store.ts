import { BaseUrl } from "@/lib/base_url";
import type { PredictionForm } from "@/types/prediction_form";
import { create } from "zustand";

type StoreProps = {
	sendPrediction: (form: PredictionForm) => Promise<any>;
};

export const usePredictionStore = create<StoreProps>(() => ({
	sendPrediction: async (form) => {
		const res = await fetch(`${BaseUrl}prediction/${form.model}`, {
			method: "POST",
			body: JSON.stringify(form),
			headers: {
				"Content-type": "application/json",
			},
		});

		const data = await res.json();

		return data;
	},
}));
