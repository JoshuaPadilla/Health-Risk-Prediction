import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/model-benchmarking")({
	component: ModelBenchmaring,
});

function ModelBenchmaring() {
	return <div>Model Benchmarking</div>;
}
