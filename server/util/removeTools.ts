export const removeDuplication = (txt, key) => {
  const map = new Map();

  txt.forEach((item, index) => {
    map.set(item, key[index]);
  });

  const resultTxt = Array.from(map.keys());
  const resultKey = Array.from(map.values());

  return { sentTxt: resultTxt, sentKey: resultKey };
};

export const removeSameSentDiffKey = (txt, key) => {
  const map = new Map();
  const duplicates = new Set();

  txt.forEach((item, index) => {
    if (map.has(item) && map.get(item) !== key[index]) {
      duplicates.add(item);
    } else {
      map.set(item, key[index]);
    }
  });

  const resultTxt = [];
  const resultKey = [];

  txt.forEach((item, index) => {
    if (!duplicates.has(item)) {
      resultTxt.push(item);
      resultKey.push(key[index]);
    }
  });

  return { sentTxt: resultTxt, sentKey: resultKey };
};
