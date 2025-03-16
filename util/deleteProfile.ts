import * as fs from "fs";
import * as path from "path";

export default function deleteParentDirectory(profilename) {
  const parentDir = path.join(process.cwd(), "doc", profilename);
    
  if (fs.existsSync(parentDir)) {
    fs.rmSync(parentDir, { recursive: true, force: true });
    console.log(`🗑️ Deleted Parent Directory and all subdirectories: ${parentDir}`);
  } else {
    console.log(`❌ Parent Directory does not exist: ${parentDir}`);
  }
}
