import {
  build,
  emptyDir,
} from "https://raw.githubusercontent.com/denoland/dnt/0.28.0/mod.ts";

await emptyDir("./npm");

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
  package: {
    name: "structurae",
    version: Deno.args[0],
    main: "./esm/index.js",
    type: "module",
    description:
      "Data structures for performance-sensitive modern JavaScript applications.",
    keywords: [
      "optimization",
      "binary",
      "binary protocol",
      "data structures",
      "sorted",
      "array",
      "bitfield",
      "bigint",
      "graph",
      "matrix",
      "heap",
      "list",
      "adjacency",
    ],
    author: "Maga D. Zandaqo <denelxan@gmail.com> (http://maga.name)",
    license: "MIT",
    dependencies: {},
    repository: {
      type: "git",
      url: "https://github.com/zandaqo/structurae.git",
    },
    homepage: "https://github.com/zandaqo/structurae#readme",
    bugs: {
      url: "https://github.com/zandaqo/structurae/issues",
    },
    exports: {
      ".": {
        types: "./types/index.d.ts",
        import: "./esm/index.js",
      },
      "./*": {
        types: "./types/*.d.ts",
        import: "./esm/*.js",
      },
    },
  },
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
