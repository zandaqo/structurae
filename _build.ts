import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";
import packageJson from "./package.json" assert { type: "json" };

await emptyDir("./npm");

packageJson.version = Deno.args[0];

await build({
  entryPoints: ["./index.ts"],
  outDir: "./npm",
  test: false,
  scriptModule: false,
  compilerOptions: {
    target: "ES2021",
    sourceMap: true,
    inlineSources: true,
  },
  shims: {
    deno: true,
  },
  package: packageJson,
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
  importMap: "./deno.jsonc",
});
