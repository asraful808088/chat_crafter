import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import sentMaping from "~/util/alterBinding";
// function isPartOfSentence(sentence, part) {
//   const words = sentence.split(/\s+/); 
//   const sentenceRegex = new RegExp(`\\b${part}\\b`, 'i'); 
  
//   return sentenceRegex.test(sentence);
// }

function isPartOfSentence(sentence, part) {
  const sentenceRegex = new RegExp(`\\b${part}\\b`); 
  return sentenceRegex.test(sentence);
}

function generateRandomCode(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export default defineEventHandler(async (event) => {
  console.log("@!23123123")
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const body = await readBody(event);
  try {
    const body = await readBody(event);
    const entitiesName = body["item"];

    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      body["of"],
      entitiesName,
      entitiesName
    );
    let alternative = path.resolve(
      process.cwd(),
      "doc",
      botname,
      body["of"],
      entitiesName,
      "alternative"
    );
    let regenerate = path.resolve(
      process.cwd(),
      "doc",
      botname,
      body["of"],
      entitiesName,
      "regenerate"
    );

    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const alterword = fs.readFileSync(`${alternative}.json`, "utf-8");
    const regeneratejson = fs.readFileSync(`${regenerate}.json`, "utf-8");
    const parseData = JSON.parse(data);
    const parseAlter = JSON.parse(alterword);
    const parseRegeneratejson = JSON.parse(regeneratejson);
    let findObj = [];
    if (body["sent"]) {
      findObj = parseData.list_of_intent.filter(
        (element) => element.mainsent == body["sent"]
      );
    } else {
      findObj = parseData.list_of_intent;
    }

    if (findObj.length != 0) {
      const lis_of_chunk = [];
      for (const element of Object.keys(parseAlter)) {
        if (parseAlter[element] instanceof Array) {
          lis_of_chunk.push({
            mainWord: element,
            alternative: parseAlter[element],
          });
        } else {
          let synPath = path.resolve(
            process.cwd(),
            "doc",
            botname,
            "synonyms",
            element,
            element
          );
          const parseSynData = JSON.parse(
            fs.readFileSync(`${synPath}.json`, "utf-8")
          );
          for (const element2 of parseSynData?.list_of_intent) {
            let partPath = path.resolve(
              process.cwd(),
              "doc",
              botname,
              "synonyms",
              element,
              `${element2?.main_word}_alterdemo_.json`
            );
            const parsePartData = JSON.parse(
              fs.readFileSync(`${partPath}`, "utf-8")
            );
            lis_of_chunk.push({
              mainWord: element2?.main_word,
              alternative: parsePartData?.generate ?? [],
            });
          }
        }
      }
      const listOfChunk = [];
      findObj.forEach((element) => {
        if (element.allAlter) {
          listOfChunk.push(lis_of_chunk);
        } else {
          let newArr = [];
          for (const element2 of element.alter) {
            const find = lis_of_chunk.find(
              (element, index) => element.mainWord == element2
            );
            if (find) {
              newArr.push(find);
            }
          }
          listOfChunk.push(newArr);
        }
      });

      const newAlterGen = findObj.map((element, index) => {
        const newItems = [];

        for (const element2 of listOfChunk[index]) {
          if (!isPartOfSentence(element?.mainsent,element2.mainWord)) { 
            continue;
          } else {
            const allAlterItems = element2.mainWord.split(" ");
            const startIndex = element.wordlist.indexOf(allAlterItems[0]) + 1;
            const mapArray = allAlterItems.map(
              (ele, indexx) => startIndex + indexx
            );
            newItems.push({
              targetIndex: mapArray,
              list_of_alter: [element2],
            });
          }
        }
        if (newItems.length == 0) {
          return null;
        }
        return {
          alterlist: newItems,
          mainSent: [element.mainsent, element.mapword, element.wordlist],
        };
      });

      const nullTriming = newAlterGen.filter((element) => element != null);
      const list_of_regenerate = [];
      if (body["of"] == "entities") {
        for (const element of nullTriming) {
          const s = sentMaping(element.alterlist, element.mainSent);
          list_of_regenerate.push({
            sent: element.mainSent[0],
            list: s[0].map((element2, index) => {
              return {
                gen: element2,
                sent: element.mainSent[0],
                map_sent: s[1][index],
                id:generateRandomCode()
              };
            }),
          });
        }
      } else {
        for (const element of nullTriming) {
          const s = sentMaping(element.alterlist, element.mainSent);
          list_of_regenerate.push({
            sent: element.mainSent[0],
            list: [...new Set(s[0])].map((element2, index) => {
              return {
                gen: element2,
                sent: element.mainSent[0],
                map_sent: element.mainSent[1],
                id:generateRandomCode()
              };
            }),
          });
        }
      }

      if (!body["sent"] || parseRegeneratejson.sents.length == 0) {
        parseRegeneratejson.sents = list_of_regenerate;
      } else {
        const newStore = parseRegeneratejson.sents.filter((element) => {
          return element.sent != body["sent"];
        });
        parseRegeneratejson.sents = [...newStore, ...list_of_regenerate];
      }
      fs.writeFileSync(
        `${regenerate}.json`,
        JSON.stringify(parseRegeneratejson, null, 2)
      );
      let flutting = [];
      parseRegeneratejson?.sents?.forEach((ele) => {
        flutting = [...flutting, ...ele.list];
      });
      return {
        items: flutting,
      };
    }
  } catch (error) {
    return {};
  }

  return {};
});
