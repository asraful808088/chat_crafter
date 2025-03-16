import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "PUT") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const body = await readBody(event);
    const entitiesName = body["item"];
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
    parseData["list_of_intent"] = parseData["list_of_intent"].map(
      (element, index) => {
        if (element.mainsent == body["update"].mainsent) {
          return body["update"];
        }
        return element;
      }
    );

    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData["list_of_intent"] };
  } catch (error) {
    return {};
  }

  return {};
});
