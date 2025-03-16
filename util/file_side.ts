import fs from "fs";
import path from "path";

function getTotalFileSize(dirPath) {
  const fullPath = path.resolve(dirPath);
  let totalSize = 0;

  if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
    const items = fs.readdirSync(fullPath);

    items.forEach((item) => {
      const itemPath = path.join(fullPath, item);

      if (fs.lstatSync(itemPath).isDirectory()) {
        totalSize += getTotalFileSize(itemPath);
      } else {
        const fileSize = fs.statSync(itemPath).size;
        totalSize += fileSize;
      }
    });
  }

  return totalSize;
}
export default getTotalFileSize