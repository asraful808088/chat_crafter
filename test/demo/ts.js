import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Function to zip a folder with full structure
 * @param {string} sourceFolder - The folder to be zipped
 * @param {string} outputZip - The output zip file path
 */
function zipFolder(sourceFolder, outputZip) {
    if (!fs.existsSync(sourceFolder)) {
        console.error(`Error: Source folder does not exist - ${sourceFolder}`);
        return;
    }

    const zip = new AdmZip();
    zip.addLocalFolder(sourceFolder);
    zip.writeZip(outputZip);

    console.log(`✅ Folder successfully zipped: ${outputZip}`);
}

// Define folder and output zip file path
const folderToZip = path.join(__dirname, "your_folder"); // Change "your_folder" to your actual folder name
const zipOutputPath = path.join(__dirname, "your_folder.zip");

// Call the function
zipFolder(folderToZip, zipOutputPath);
