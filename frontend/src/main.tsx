import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "./components/ui/sonner";

const router = createRouter({
	routeTree,
	context: {
		user: undefined!,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
	const user = "ME";
	// 2. Pass the live state into the context prop
	return <RouterProvider router={router} context={{ user }} />;
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
