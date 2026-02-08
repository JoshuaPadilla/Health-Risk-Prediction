import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/assess")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/assess"!</div>;
}
