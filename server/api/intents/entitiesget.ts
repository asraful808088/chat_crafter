import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  const botname = botinfo["name"];
  const query = getQuery(event);
  const entitiesName = query["item"];
  try {
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
    const details = JSON.parse(fs.readFileSync(path.resolve(
      process.cwd(),
      "doc",
      botname,
      "intents",
      entitiesName,
      "details.json"
    ), "utf-8"));
    return {
      items: parseData.list_of_intent,
      entities: parseData?.entities ?? [],
      details
    };
  } catch (error) {
    return {};
  }

  return {};
});
