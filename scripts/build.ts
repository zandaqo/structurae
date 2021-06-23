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
    const newName = fileName.replace(/file\:\/\/\//g, "")
      .replace(/\.ts\./g, "."); // remove .ts extenstion
    let content = text;
    if (isJS || isDTS) {
      content = text.replace(/\.ts";/g, isDTS ? '";' : '.js";') // remove .ts extension
        .replace(/^\/\/\/.*?\/>\s/g, ""); // remove triple slash comments
    }
    Deno.writeTextFileSync(newName, content);
  }
  console.log("Done!");
} catch (e) {
  console.log(e);
}
