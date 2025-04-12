import AdmZip from "adm-zip";
import fs from "fs";

export default function zipFolder(sourceFolder, outputZip) {
  if (!fs.existsSync(sourceFolder)) {
    console.error(`Error: Source folder does not exist - ${sourceFolder}`);
    return;
  }

  const zip = new AdmZip();
  zip.addLocalFolder(sourceFolder);
  zip.writeZip(outputZip);

  console.log(`✅ Folder successfully zipped: ${outputZip}`);
}
