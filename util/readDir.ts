import fs from "fs";
import path from "path";

function readAllDirs(selectedDir,file=false) {
  const fullPath = path.resolve(selectedDir);
  if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory() && file==false) {
    const list_of_dir = [];
    const items = fs.readdirSync(fullPath);
    items.forEach((item) => {
      const itemPath = path.join(fullPath, item);
      if (fs.lstatSync(itemPath).isDirectory()) {
        list_of_dir.push(item);
      }
    });
    return list_of_dir;
  }else{
    const list_of_dir = [];
    const items = fs.readdirSync(fullPath);
    items.forEach((item) => {
      const itemPath = path.join(fullPath, item);
      if (fs.lstatSync(itemPath)) {
        list_of_dir.push(item);
      }
    });
    return list_of_dir;
  }
}
export default readAllDirs;
