const fs = require("fs");

const folder = "./dist";
const getPath = file => `${folder}/${file}`;

(async () => {
  console.log("START");
  const jsFiles = await getFiles();

  const filesToDelete = jsFiles.filter(file => !file.endsWith(".min.js"));
  const filesToRename = jsFiles.filter(
    file => filesToDelete.indexOf(file) === -1
  );

  console.log("delete", filesToDelete);
  console.log("rename", filesToRename);

  await Promise.all(
    filesToDelete.map(file =>
      fs.unlink(getPath(file), err => {
        console.log("Error deleting file: " + file, err);
      })
    )
  );
  console.log("Done deleting files");

  await Promise.all(
    filesToRename.map(file =>
      fs.rename(
        getPath(file),
        getPath(file.replace(".min", ""), err => {
          console.log("Error renaming file: " + file, err);
        })
      )
    )
  );

  console.log("Done renaming files");
})();

async function getFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      const jsFiles = files.filter(file => file.endsWith(".js"));
      resolve(jsFiles);
    });
  });
}
