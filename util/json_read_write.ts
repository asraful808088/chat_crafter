import fs from "fs";

export function deleteJsonFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
}

export function createJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Created: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file: ${error.message}`);
  }
}
