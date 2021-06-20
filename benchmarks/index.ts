import { runBenchmarks } from "../dev_deps.ts";
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
