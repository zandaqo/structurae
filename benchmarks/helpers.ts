import {
  BenchmarkResult,
  BenchmarkRunResult,
} from "https://deno.land/std@0.95.0/testing/bench.ts";

const reSuitName = /^\[(.*?)\]\s(.*?)$/i;

export function getIndex(size: number) {
  return (Math.random() * size) | 0;
}

export function benchmarkReporter(result: BenchmarkRunResult) {
  const allResults = result.results;
  const suits = new Map<string, Array<BenchmarkResult>>();
  const orphans: Array<BenchmarkResult> = [];
  for (const result of allResults) {
    const match = reSuitName.exec(result.name);
    if (match) {
      const [, suitName, testName] = match;
      result.name = testName;
      if (!suits.has(suitName)) suits.set(suitName, []);
      suits.get(suitName)!.push(result);
    } else {
      orphans.push(result);
    }
  }
  if (orphans.length) suits.set("", orphans);
  for (const [suitName, suitResults] of suits.entries()) {
    console.log("");
    if (suitName) console.log(`${suitName}:`);
    suitResults.sort((a, b) => a.totalMs > b.totalMs ? 1 : -1);
    const fastest = suitResults[0];
    console.log(`1. ${fastest.name} (${fastest.totalMs}ms) - 100%`);
    for (let i = 1; i < suitResults.length; i += 1) {
      const benchmark = suitResults[i];
      console.log(
        `${i + 1}. ${benchmark.name} (${benchmark.totalMs}ms) - ${
          (1 / (benchmark.totalMs / fastest.totalMs) * 100).toFixed(2)
        }%`,
      );
    }
  }
}
