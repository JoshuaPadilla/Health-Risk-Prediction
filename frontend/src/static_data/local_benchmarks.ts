import type { BenchmarkEntry } from "@/static_data/model_benchmarks";
import localBenchmarksJson from "@prediction/local_benchmarks.json";

export const LocalBenchmarks = localBenchmarksJson as BenchmarkEntry[];
