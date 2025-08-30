import * as fs from "fs";
import { getQuery } from "h3";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
 
  const query = getQuery(event);
  try {
    const entitiesName = query["item"];
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      query["of"],
      entitiesName,
      entitiesName
    );
    let filePath2 = path.resolve(
      process.cwd(),
      "doc",
      botname,
      query["of"],
      entitiesName,
      "regenerate"
    );

    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const data2 = fs.readFileSync(`${filePath2}.json`, "utf-8");
    const parseData = JSON.parse(data);
    const parseData2 = JSON.parse(data2);
    parseData.list_of_intent = parseData.list_of_intent.filter(
      (element, index) => element.mainsent != query["delete"]
    );
    parseData2.sents = parseData2.sents.filter((element, index) => {
      // console.log(element.sent)
      // console.log(query["delete"])
      return element.sent != query["delete"];
    });
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    fs.writeFileSync(`${filePath2}.json`, JSON.stringify(parseData2, null, 2));
    let flutting = [];
    parseData2?.sents?.forEach((ele) => {
      flutting = [...flutting, ...ele.list];
    });
    return { items: parseData.list_of_intent, alter_item: flutting };
  } catch (error) {
    return {};
  }

  return {};
});
