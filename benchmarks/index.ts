import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.95.0/testing/bench.ts";
import { benchmarkReporter } from "./helpers.ts";

import "./bit-field-match.ts";
import "./graphs.ts";
import "./grids.ts";
import "./object-pool.ts";
import "./sorted-structures.ts";
import "./strings.ts";
import "./view-protocol.ts";

runBenchmarks().then(benchmarkReporter).catch((e) => {
  console.log(e);
});
