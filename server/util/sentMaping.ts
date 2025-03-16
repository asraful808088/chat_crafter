import fs from "fs";
import path from "path";
import readAllDirs from "~/util/readDir";
import { removeDuplication, removeSameSentDiffKey } from "./removeTools";
export default function sentMapping(bot) {
  const parentDir = path.join(process.cwd(), "doc", bot, "intents");
  let sentTxt = [];
  let sentKey = [];
  let fileList = readAllDirs(parentDir);
  if (!fileList) {
    fileList = [];
  }
  for (const filename of fileList) {
    const filepath = path.join(
      process.cwd(),
      "doc",
      bot,
      "intents",
      filename,
      filename
    );
    const regen = path.join(
      process.cwd(),
      "doc",
      bot,
      "intents",
      filename,
      "regenerate"
    );
    const detailsj = path.join(
      process.cwd(),
      "doc",
      bot,
      "intents",
      filename,
      "details"
    );
    const stringData1 = fs.readFileSync(`${filepath}.json`, "utf-8");
    const stringData2 = fs.readFileSync(`${regen}.json`, "utf-8");
    const stringData3 = fs.readFileSync(`${detailsj}.json`, "utf-8");
    const jsonData1 = JSON.parse(stringData1);
    const jsonData2 = JSON.parse(stringData2);
    const jsonData3 = JSON.parse(stringData3);
    let templist = [];
    const sentType = jsonData3["type"];
    for (const item of jsonData2["sents"]) {
      templist.push(item);
    }
    for (const itemobj of jsonData1["list_of_intent"]) {
      templist.push(itemobj["mainsent"]);
    }
    templist = [...new Set(templist)];
    for (const element of templist) {
      sentTxt.push(element);
      sentKey.push(sentType);
    }
  }
  const feedBack = removeSameSentDiffKey(sentTxt, sentKey);
  sentTxt = feedBack["sentTxt"];
  sentKey = feedBack["sentKey"];
  const feedBack2 = removeDuplication(sentTxt, sentKey);
  sentTxt = feedBack2["sentTxt"];
  sentKey = feedBack2["sentKey"];
  return { sentTxt: sentTxt, sentKey: sentKey };
}
