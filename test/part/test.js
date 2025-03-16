// function splitSentenceByPunctuation(sentence) {
//   const sentSplit = sentence.split(" ");
//   const enArr = new Array(sentSplit.length).fill("O");
//   const mapIndex = sentSplit.map((element, index) =>element);

//   return [sentence, enArr,mapIndex];
// }

// const sentence = "Hello world! How are you doing today? I'm fine, thanks.";

// const result = splitSentenceByPunctuation(sentence);
// result[1][0] = "B-String";
// result[1][1] = "J-String";
// console.log(result);

const s = [
  "Hello world! How are you doing today? I'm fine, thanks.",
  ["B-Strings", "O", "O", "O", "O", "O", "O", "O", "O", "O"],
  [
    "Hello",
    "world!",
    "How",
    "are",
    "you",
    "doing",
    "today?",
    "I'm",
    "fine,",
    "thanks.",
  ],
];

const wordMap = {
  labelName: {
    mainWord: "good s",
    alternative: ["nice", "nic2", "nice2", "nice3"],
  },
  labelName2: {
    mainWord: "bad s",
    alternative: ["not nice", "not nic2", "not nice2", "not nice3"],
  },
};

const alternative = [
  {
    targetIndex: [1],
    list_of_alter: [wordMap.labelName, wordMap.labelName2],
  },
];

function checkValidityNER(items) {
  let bItems = items.filter((item) => item.startsWith("B-"));
  if (bItems.length > 1) {
    return {
      invalid: false,
      error: 1,
    };
  }
  if (
    items.includes("O") &&
    items.some((item) => item.startsWith("B-") || item.startsWith("J-"))
  ) {
    return {
      invalid: false,
      error: 2,
    };
  }
  if (
    items.includes("O") &&
    !items.some((item) => item.startsWith("B-") || item.startsWith("J-"))
  ) {
    return {
      invalid: true,
    };
  }

  let bIndex = items.findIndex((item) => item.startsWith("B-"));
  let jIndex = items.findIndex((item) => item.startsWith("J-"));

  if (bIndex === -1 && jIndex === -1) {
    return {
      invalid: true,
    };
  } else if (bIndex === -1) {
    return {
      invalid: true,
    };
  } else if (jIndex === -1) {
    return {
      invalid: true,
    };
  } else {
    if (bIndex < jIndex) {
      return {
        invalid: true,
      };
    } else {
      return {
        invalid: false,
        error: 4,
      };
    }
  }
}

function sentMapper(mainWord, ENpart2, withOutB = false) {
  let wordList = [];
  let entitywordList = [];
  if (mainWord.length == 1) {
    wordList.push(mainWord[0]);
    entitywordList.push(ENpart2[0]);
  } else {
    for (let index = 0; index < mainWord.length; index++) {
      const sE = mainWord[index];
      if (index == 0) {
        wordList.push(sE);
        entitywordList.push(ENpart2[0]);
      } else {
        if (withOutB) {
          wordList.push(sE);
          entitywordList.push(ENpart2[0]);
        } else {
          wordList.push(sE);
          entitywordList.push(
            ENpart2[1] ? ENpart2[1] : ENpart2[0].replace("B-", "J-")
          );
        }
      }
    }
  }
  return [wordList, entitywordList];
}

function sentMaping(alternative, sentmap) {
  let newCreateItems = [];
  let entitiesItems = [];
  for (const element of alternative) {
    const start_index = Math.min(...element["targetIndex"]);
    const end_index = Math.max(...element["targetIndex"]);
    const result = checkValidityNER(
      sentmap[1].slice(start_index - 1, end_index)
    );

    if (result["invalid"]) {
      const part1 = sentmap[2].slice(0, start_index - 1);
      const part2 = sentmap[2].slice(start_index - 1, end_index);
      const part3 = sentmap[2].slice(end_index);
      const ENpart1 = sentmap[1].slice(0, start_index - 1);
      const ENpart2 = sentmap[1].slice(start_index - 1, end_index);
      const ENpart3 = sentmap[1].slice(end_index);

      const r = ENpart2.some((item) => item.startsWith("B-"));
      if (r) {
        for (const subItem of element["list_of_alter"]) {
          const mainWord = subItem.mainWord.split(" ");

          let wordBuild = sentMapper(mainWord, ENpart2);
          newCreateItems.push([...part1, ...wordBuild[0], ...part3].join(" "));
          entitiesItems.push([...ENpart1, ...wordBuild[1], ...ENpart3]);
          for (let index = 0; index < subItem["alternative"].length; index++) {
            let wordBuild = sentMapper(
              subItem["alternative"][index].split(" "),
              ENpart2
            );
            newCreateItems.push(
              [...part1, ...wordBuild[0], ...part3].join(" ")
            );
            entitiesItems.push([...ENpart1, ...wordBuild[1], ...ENpart3]);
          }
         
        }
      } else {
        for (const subItem of element["list_of_alter"]) {
          const mainWord = subItem.mainWord.split(" ");

          let wordBuild = sentMapper(mainWord, ENpart2, true);
          newCreateItems.push([...part1, ...wordBuild[0], ...part3].join(" "));
          entitiesItems.push([...ENpart1, ...wordBuild[1], ...ENpart3]);
          for (let index = 0; index < subItem["alternative"].length; index++) {
            let wordBuild = sentMapper(
              subItem["alternative"][index].split(" "),
              ENpart2,
              true
            );
            newCreateItems.push(
              [...part1, ...wordBuild[0], ...part3].join(" ")
            );
            entitiesItems.push([...ENpart1, ...wordBuild[1], ...ENpart3]);
          }
         
        }
      }
    }
  }
  return newCreateItems
}

console.log(sentMaping(alternative, s));
