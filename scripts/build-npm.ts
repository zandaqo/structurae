import { build } from "https://raw.githubusercontent.com/denoland/dnt/0.12.0/mod.ts";

await Deno.remove("npm", { recursive: true }).catch((_) => {});

await build({
  entryPoints: ["./index.ts"],
  outDir: "./npm",
  typeCheck: false,
  test: false,
  cjs: false,
  declaration: true,
  compilerOptions: {
    target: "ES2021",
    sourceMap: true,
    inlineSources: true,
  },
  shims: {},
  package: {
    name: "structurae",
    version: Deno.args[0],
    main: "index.js",
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
    files: [
      "*.js",
      "*.js.map",
      "*.d.ts",
    ],
    dependencies: {},
    repository: {
      type: "git",
      url: "https://github.com/zandaqo/structurae.git",
    },
    homepage: "https://github.com/zandaqo/structurae#readme",
    bugs: {
      url: "https://github.com/zandaqo/structurae/issues",
    },
    engines: {
      node: ">=14.0.0",
    },
  },
});
const decoder = new TextDecoder();
const packageJson = JSON.parse(
  decoder.decode(Deno.readFileSync("./npm/package.json")),
);

console.log("[build] Flattern directory tree...");
for (const dir of ["esm", "types"]) {
  for await (const entry of Deno.readDir(`./npm/${dir}`)) {
    if (!entry.isFile) continue;
    if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      Deno.renameSync(`./npm/${dir}/${entry.name}`, `./npm/${entry.name}`);
    } else if (entry.name.endsWith(".js.map")) {
      // fix source paths
      const source = JSON.parse(
        decoder.decode(Deno.readFileSync(`./npm/${dir}/${entry.name}`)),
      );
      source.sources = [
        entry.name.substring(0, entry.name.indexOf(".")) + ".ts",
      ];
      Deno.writeTextFileSync(`./npm/${entry.name}`, JSON.stringify(source));
    }
  }
  Deno.removeSync(`./npm/${dir}`, { recursive: true });
}

console.log("[build] Copy docs...");
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");

console.log("[build] Fix package.json...");
delete packageJson.exports;
delete packageJson.types;
delete packageJson.module;
Deno.writeFileSync(
  "./npm/package.json",
  new TextEncoder().encode(JSON.stringify(packageJson)),
);
await Deno.remove("npm/package-lock.json").catch((_) => {});
console.log("[build] Done!");
