import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export const createDirAndSaveJSON = (dirPath, jsonData,pathx = "data.json") => {
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    } else {
        console.log(`Directory already exists: ${dirPath}`);
    }

    const filePath = join(dirPath, pathx);
    writeFileSync(pathx, JSON.stringify(jsonData, null, 4));
    console.log(`JSON file created at: ${filePath}`);
};

