const fs = require('fs-extra');
const archiver = require('archiver');
const pathModule = require('path');

async function zipAndRemove(targetPath) {
  const path = pathModule.resolve(targetPath);
  const isDir = await fs.lstat(path).then(stat => stat.isDirectory());

  const zipPath = path + '.zip';
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', async () => {
      console.log(`Created zip: ${zipPath} (${archive.pointer()} total bytes)`);

      try {
        await fs.remove(path); 
        console.log('Original removed:', path);
        resolve(zipPath);
      } catch (err) {
        reject(`Zip created but failed to delete original: ${err}`);
      }
    });

    archive.on('error', err => reject(err));

    archive.pipe(output);

    if (isDir) {
      archive.directory(path, false);
    } else {
      archive.file(path, { name: pathModule.basename(path) });
    }

    archive.finalize();
  });
}
export zipAndRemove