import {
  build,
  emptyDir,
} from "https://raw.githubusercontent.com/denoland/dnt/0.31.0/mod.ts";
import packageJson from "./package.json" assert { type: "json" };

await emptyDir("./npm");

packageJson.version = Deno.args[0];

await build({
  entryPoints: ["./index.ts"],
  outDir: "./npm",
  typeCheck: false,
  test: false,
  scriptModule: false,
  compilerOptions: {
    target: "ES2021",
    sourceMap: true,
    inlineSources: true,
  },
  shims: {},
  package: packageJson,
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
