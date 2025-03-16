export default function getModuleObj(code) {
  const regex = /(import|from)\s+(\w+)(?:\s+import\s+(\*|\w+))?/g;
  const matches = new Map();

  let match;
  while ((match = regex.exec(code)) !== null) {
    const type = match[1]; 
    const moduleName = match[2]; 
    const importedName = match[3] || null; 
    const key = importedName ? `${moduleName}:${importedName}` : moduleName;

    if (!matches.has(key)) {
      if (importedName) {
        matches.set(key, {
          type: "module",
          name: moduleName,
          ...(importedName === '*' ? { star: true } : { import: importedName }),
        });
      } else {
        matches.set(key, { type: "module", name: moduleName });
      }
    }
  }

  return Array.from(matches.values());
}

