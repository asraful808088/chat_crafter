import fs from "fs";
import path from "path";

function deleteDirWithContents(dirPath) {
  const fullPath = path.resolve(dirPath);

  try {
    if (fs.existsSync(fullPath)) {
      fs.readdirSync(fullPath).forEach((item) => {
        const itemPath = path.join(fullPath, item);

        if (fs.lstatSync(itemPath).isDirectory()) {
          deleteDirWithContents(itemPath);
        } else {
          fs.unlinkSync(itemPath);
        }
      });

      fs.rmdirSync(fullPath);
    } else {
    }
  } catch (error) {}
}
export default deleteDirWithContents;
