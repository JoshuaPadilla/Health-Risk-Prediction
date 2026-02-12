import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "./components/ui/sonner";
import { usePredictionStore } from "./stores/prediction_store";

const router = createRouter({
	routeTree,
	context: {
		prediction: undefined!,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
	const prediction = usePredictionStore(); // 2. Pass the live state into the context prop
	return <RouterProvider router={router} context={{ prediction }} />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<App />
			<Toaster />
		</StrictMode>,
	);
}
