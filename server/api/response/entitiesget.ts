import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  const botname = botinfo["name"];
  const entitiesName = getQuery(event)["item"];
  try {
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "response",
      entitiesName,
      entitiesName
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    return { items: parseData.list_of_intent };
  } catch (error) {
    return {};
  }

  return {};
});
