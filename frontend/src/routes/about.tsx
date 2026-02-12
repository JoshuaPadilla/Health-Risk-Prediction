import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Server,
	Database,
	Layout,
	BrainCircuit,
	GitBranch,
	CheckCircle2,
	BookOpen,
	School,
	Users,
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	// Animation variants for smooth entry
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	return (
		<div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
			<motion.div
				className="max-w-5xl mx-auto space-y-12"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Header Section */}
				<motion.div
					variants={itemVariants}
					className="text-center space-y-4"
				>
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
						Student Performance{" "}
						<span className="text-primary">Prediction System</span>
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						A web-based application designed to forecast entrance
						examination outcomes using supervised machine learning
						classification techniques.
					</p>
					<div className="flex justify-center gap-2 mt-4">
						<Badge variant="secondary">Thesis Project</Badge>
						<Badge variant="outline">Chapter 3: Methodology</Badge>
					</div>
				</motion.div>

				{/* System Objectives */}
				<motion.div variants={itemVariants}>
					<Card className="border-l-4 border-l-primary shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CheckCircle2 className="h-6 w-6 text-primary" />
								System Objectives
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-2">
							{[
								"Predict student performance with high accuracy",
								"Comparative analysis of classification algorithms",
								"Enable data-driven decision making",
								"Support early intervention strategies",
								"Visualize performance metrics accessibly",
							].map((obj, i) => (
								<div key={i} className="flex items-start gap-2">
									<div className="h-2 w-2 mt-2 rounded-full bg-primary/60" />
									<span className="text-sm text-gray-700">
										{obj}
									</span>
								</div>
							))}
						</CardContent>
					</Card>
				</motion.div>

				{/* Architecture & Modules */}
				<div className="grid md:grid-cols-3 gap-6">
					{/* Frontend */}
					<motion.div
						variants={itemVariants}
						className="md:col-span-1"
					>
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Layout className="h-5 w-5 text-blue-500" />
									Presentation Layer
								</CardTitle>
								<CardDescription>Frontend & UI</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-gray-600">
									React-based interface with responsive
									design. Handles user interactions, form
									validation, and data visualization.
								</p>
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary">
										React 19.0
									</Badge>
									<Badge variant="secondary">
										Tailwind CSS
									</Badge>
									<Badge variant="secondary">Recharts</Badge>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Backend */}
					<motion.div
						variants={itemVariants}
						className="md:col-span-1"
					>
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Server className="h-5 w-5 text-green-500" />
									Application Layer
								</CardTitle>
								<CardDescription>API & Logic</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-gray-600">
									FastAPI backend managing data preprocessing,
									feature encoding, and model inference via
									REST endpoints.
								</p>
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary">FastAPI</Badge>
									<Badge variant="secondary">Python</Badge>
									<Badge variant="secondary">Joblib</Badge>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Data & ML */}
					<motion.div
						variants={itemVariants}
						className="md:col-span-1"
					>
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Database className="h-5 w-5 text-purple-500" />
									Data Layer
								</CardTitle>
								<CardDescription>
									Storage & Intelligence
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-gray-600">
									MongoDB for persistence and scikit-learn for
									the classification logic using 4 distinct
									algorithms.
								</p>
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary">MongoDB</Badge>
									<Badge variant="secondary">
										scikit-learn
									</Badge>
									<Badge variant="secondary">Pandas</Badge>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Machine Learning Algorithms Section */}
				<motion.div variants={itemVariants}>
					<h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
						<BrainCircuit className="h-6 w-6" />
						Machine Learning Algorithms
					</h2>
					[Image of machine learning algorithm comparison chart]
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{[
							{
								name: "Logistic Regression",
								desc: "Linear model for binary classification with probability estimation.",
							},
							{
								name: "Decision Tree",
								desc: "Non-parametric model using tree-structured decision rules.",
							},
							{
								name: "Naive Bayes",
								desc: "Probabilistic classifier based on Bayes' theorem (Gaussian).",
							},
							{
								name: "Random Forest",
								desc: "Ensemble method combining multiple decision trees.",
							},
						].map((algo, i) => (
							<Card
								key={i}
								className="bg-slate-50 border-slate-200"
							>
								<CardHeader className="pb-2">
									<CardTitle className="text-base font-semibold">
										{algo.name}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-xs text-muted-foreground">
										{algo.desc}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</motion.div>

				{/* Decision Support Capabilities */}
				<motion.div variants={itemVariants}>
					<Card>
						<CardHeader>
							<CardTitle className="text-xl">
								Decision Support Capabilities
							</CardTitle>
							<CardDescription>
								Who benefits from this system?
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-6 md:grid-cols-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2 font-semibold text-primary">
									<BookOpen className="h-5 w-5" />
									For Students
								</div>
								<p className="text-sm text-gray-600 leading-relaxed">
									Assess readiness for entrance exams.
									Probability scores help decide on review
									classes and study adjustments.
								</p>
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-2 font-semibold text-primary">
									<School className="h-5 w-5" />
									For Institutions
								</div>
								<p className="text-sm text-gray-600 leading-relaxed">
									Support admissions planning, resource
									allocation, and identification of at-risk
									student populations.
								</p>
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-2 font-semibold text-primary">
									<Users className="h-5 w-5" />
									For Researchers
								</div>
								<p className="text-sm text-gray-600 leading-relaxed">
									A reproducible framework for investigating
									classification techniques in educational
									data mining.
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Workflow Diagram Representation */}
				<motion.div
					variants={itemVariants}
					className="bg-white p-8 rounded-xl border text-center space-y-6"
				>
					<h3 className="text-lg font-semibold flex items-center justify-center gap-2">
						<GitBranch className="h-5 w-5" />
						System Workflow
					</h3>
					<div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
						<div className="p-3 bg-gray-100 rounded-lg">
							Input Data
						</div>
						<div className="hidden md:block">→</div>
						<div className="md:hidden">↓</div>
						<div className="p-3 bg-gray-100 rounded-lg">
							Preprocessing
						</div>
						<div className="hidden md:block">→</div>
						<div className="md:hidden">↓</div>
						<div className="p-3 bg-blue-50 text-blue-700 font-medium rounded-lg border border-blue-200">
							ML Inference (4 Models)
						</div>
						<div className="hidden md:block">→</div>
						<div className="md:hidden">↓</div>
						<div className="p-3 bg-gray-100 rounded-lg">
							Visualization
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
