import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="p-2 bg-amber-200">
			<Button variant={"default"}>asdasd</Button>
		</div>
	);
}
