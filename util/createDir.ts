import fs from "fs";

export default function checkAndCreateDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    } else {
    }
  } catch (error) {
    return false;
  }
  return true;
}
