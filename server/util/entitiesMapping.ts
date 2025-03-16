import fs from "fs";
import path from "path";
export default function entitiesMapping(bot, list_ofentities = []) {
  const parentDir = path.join(process.cwd(), "doc", bot, "entities");
  let sentTxt = [];
  let sentKey = [];
  let fileList = list_ofentities;
  if (!fileList) {
    fileList = [];
  }
  for (const filename of fileList) {
    const filepath = path.join(
      process.cwd(),
      "doc",
      bot,
      "entities",
      filename,
      filename
    );
    const regen = path.join(
      process.cwd(),
      "doc",
      bot,
      "entities",
      filename,
      "regenerate"
    );
    const stringData1 = fs.readFileSync(`${filepath}.json`, "utf-8");
    const stringData2 = fs.readFileSync(`${regen}.json`, "utf-8");
    const jsonData1 = JSON.parse(stringData1);
    const jsonData2 = JSON.parse(stringData2);
    for (const element of jsonData2["sents"]) {
      for (const element2 of element["list"]) {
        sentTxt.push(element2.gen);
        sentKey.push(element2.map_sent);
      }
    }
    for (const element of jsonData1["list_of_intent"]) {
      if (!sentTxt.includes(element.mainsent)) {
        sentTxt.push(element.mainsent);
        sentKey.push(element.mapword);
      }
    }
  }

  return { sentTxt: sentTxt, sentKey: sentKey };
}
