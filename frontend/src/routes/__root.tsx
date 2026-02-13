import { AppFooter } from "@/components/custom_components/app_footer";
import AppHeader from "@/components/custom_components/app_header";
import type { usePredictionStore } from "@/stores/prediction_store";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface MyRouterContext {
	prediction: ReturnType<typeof usePredictionStore.getState>;
}

const RootLayout = () => (
	<>
		<AppHeader />
		<hr />
		<Outlet />
		<AppFooter />

		<TanStackRouterDevtools />
	</>
);

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
});
