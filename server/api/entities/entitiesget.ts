import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  const botname = botinfo["name"];
  try {
    const getq = getQuery(event);
    const entitiesName = getq["item"];
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "entities",
      entitiesName,
      entitiesName
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    return { items: parseData.list_of_intent, entities: parseData?.entities??[] };
  } catch (error) {
    return {};
  }

  return {};
});
