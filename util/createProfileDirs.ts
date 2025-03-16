import * as fs from "fs";
import * as path from "path";

export default function ensureDirectories(profilename) {
const parentDir = path.join(process.cwd(), "doc",profilename); 
const subDirs = ["condition", "custom-actions", "entities","intents","response","scripts","synonyms","task"];


  let missingDirs = [];

  if (!fs.existsSync(parentDir)) {
    missingDirs.push(`Parent Directory: ${parentDir}`);
    fs.mkdirSync(parentDir, { recursive: true });
    console.log(`✅ Created Parent Directory: ${parentDir}`);
  }

  subDirs.forEach((subDir) => {
    const subDirPath = path.join(parentDir, subDir);
    if (!fs.existsSync(subDirPath)) {
      missingDirs.push(`Subdirectory: ${subDirPath}`);
      fs.mkdirSync(subDirPath, { recursive: true });
      console.log(`✅ Created Subdirectory: ${subDirPath}`);
    }
  });

  if (missingDirs.length > 0) {
    console.log("\n🛠️ The following directories were missing and created:");
    console.log(missingDirs.join("\n"));
  } else {
    console.log("\n✅ All directories already exist. No changes made.");
  }
}


