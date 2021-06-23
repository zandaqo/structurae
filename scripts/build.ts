try {
  const { files } = await Deno.emit("index.ts", {
    compilerOptions: {
      "target": "es2020",
      "module": "es2015",
      "sourceMap": true,
      "inlineSources": true,
      "declaration": true,
      "removeComments": false,
    },
  });
  for (const [fileName, text] of Object.entries(files)) {
    const isJS = fileName.endsWith(".js");
    const isDTS = !isJS && fileName.endsWith(".d.ts");
    const name = fileName.substring(
      fileName.lastIndexOf("/") + 1,
      fileName.indexOf("."),
    );
    const path = fileName.replace(/file\:\/\/\//g, "")
      .replace(/\.ts\./g, "."); // remove .ts extenstion
    let content = text;
    if (isJS || isDTS) {
      content = text.replace(/\.ts";/g, isDTS ? '";' : '.js";') // remove .ts extension
        .replace(/^\/\/\/.*?\/>\s/g, ""); // remove triple slash comments
      if (isJS) {
        content += `\n//# sourceMappingURL=${name + ".js.map"}`; // add link to source file
      }
    } else if (path.endsWith(".js.map")) {
      const source = JSON.parse(text);
      source.file = name + ".js";
      source.sources = [name + ".ts"];
      content = JSON.stringify(source);
    }
    Deno.writeTextFileSync(path, content);
  }
  console.log("Done!");
} catch (e) {
  console.log(e);
}
