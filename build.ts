for await (const dirEntry of Deno.readDir(Deno.realPathSync("./build"))) {
  if (!dirEntry.isFile) continue;
  const fileName = dirEntry.name;
  const isJS = fileName.endsWith(".js");
  const isDTS = !isJS && fileName.endsWith(".d.ts");
  if (!isJS && !isDTS) continue;
  const filePath = Deno.realPathSync("./build/" + fileName);
  let content = Deno.readTextFileSync(filePath);
  content = content.replace(/\.ts";/g, isDTS ? '";' : '.js";');
  Deno.writeTextFileSync(filePath, content);
  console.log(dirEntry.name);
}
