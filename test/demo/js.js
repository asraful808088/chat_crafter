// const code = `
// from enum import Enum
// class ConditionTypes(Enum):
//       VALUE_1 = "VALUE_1"
//       VALUE_2 = "VALUE_2"
//       VALUE_3 = "VALUE_3"
//       VALUE_4 = "VALUE_4"

// def hello_word():
//       pass

// class DemoClass():
//       pass
// `;

// function getTypeReadObj(code) {
//   const enumRegex = /class\s+(\w+)\(Enum\):([\s\S]*?)(?=\n{2,}|\Z)/g;  // Fixed regex
//   const functionRegex = /def\s+(\w+)\s*\(/g;
//   const classRegex = /class\s+(\w+)\s*\(/g;

//   const results = [];

//   // Extract Enums
//   let match;
//   while ((match = enumRegex.exec(code)) !== null) {
//     const name = match[1];
//     const body = match[2];
//     const items = [...body.matchAll(/(\w+)\s*=/g)].map((m) => m[1]);

//     results.push({ type: "enum", name, items });
//   }

//   while ((match = functionRegex.exec(code)) !== null) {
//     results.push({ type: "function", name: match[1] });
//   }

//   // Extract Classes (excluding Enums)
//   while ((match = classRegex.exec(code)) !== null) {
//     const className = match[1];
//     if (!results.some((obj) => obj.name === className)) {
//       results.push({ type: "class", name: className });
//     }
//   }
//   return results;
// }

// console.log(getTypeReadObj(code));
function isPartOfSentence(sentence, part) {
  const words = sentence.split(/\s+/); 
  const sentenceRegex = new RegExp(`\\b${part}\\b`, 'i'); 
  
  return sentenceRegex.test(sentence);
}

// **Test Cases**
console.log(isPartOfSentence("this is my a name", "a name")); // ✅ true
