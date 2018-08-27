const fs = require("fs");
const ClosureCompiler = require("google-closure-compiler").compiler;

const folder = "./dist";

(async () => {
  console.log("START");
  const jsFiles = await getFiles();
  await compileFiles(jsFiles);
  console.log("DONE");
})();

async function getFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      const jsFiles = files.filter(
        file => file.endsWith(".js") && !file.endsWith(".min.js")
      );
      resolve(jsFiles);
    });
  });
}

async function compileFiles(jsFiles) {
  console.log("compile: ", jsFiles);
  await Promise.all(
    jsFiles.map(f => {
      const filePath = folder + "/" + f;
      return compileFile(filePath);
    })
  );
}

function compileFile(filePath) {
  return new Promise((resolve, reject) => {
    const outputPath = filePath.replace(".js", ".min.js");
    new ClosureCompiler({
      js: filePath,
      js_output_file: outputPath
    }).run((exitCode, stdOut, stdErr) => {
      console.log("compiler", exitCode, stdOut.length, stdErr.length);
      resolve([filePath, outputPath]);
    });
  });
}
