import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "PUT") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const entitiesName = "test";

  try {
    const body = await readBody(event);
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "intents",
      entitiesName,
      entitiesName
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    let newList = body["list"]
    newList = newList.map((element,index)=>{
      return {...element,alter:[]}
    })
    parseData["list_of_intent"] = [
      ...newList,
      ...parseData["list_of_intent"],
    ];
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData.list_of_intent };
  } catch (error) {
    return {};
  }

  return {};
});
