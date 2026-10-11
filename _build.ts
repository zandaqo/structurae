import { build, emptyDir } from "@deno/dnt";
import packageJson from "./package.json" with { type: "json" };

await emptyDir("./npm");

packageJson.version = Deno.args[0] ?? packageJson.version;

await build({
  entryPoints: ["./index.ts"],
  outDir: "./npm",
  scriptModule: false,
  compilerOptions: {
    target: "ES2021",
    lib: ["ES2022", "ESNext.Collection", "DOM", "DOM.Iterable"],
    sourceMap: true,
    inlineSources: true,
  },
  shims: {
    deno: { test: "dev" },
  },
  package: packageJson,
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
