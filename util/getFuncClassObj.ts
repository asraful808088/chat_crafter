export default function getTypeReadObj(code) {
  const enumRegex = /class\s+(\w+)\(Enum\):([\s\S]*?)(?=\n\n|\Z)/g;
  const functionRegex = /def\s+(\w+)\s*\(/g;
  const classRegex = /class\s+(\w+)\s*\(/g;

  const results = [];

  let match;
  while ((match = enumRegex.exec(code)) !== null) {
    const name = match[1];
    const body = match[2];
    const items = [...body.matchAll(/(\w+)\s*=/g)].map((m) => m[1]);

    results.push({ type: "enum", name, items });
  }

  while ((match = functionRegex.exec(code)) !== null) {
    results.push({ type: "function", name: match[1] });
  }

  while ((match = classRegex.exec(code)) !== null) {
    const className = match[1];
    if (!results.some((obj) => obj.name === className)) {
      results.push({ type: "class", name: className });
    }
  }
  return results;
}
