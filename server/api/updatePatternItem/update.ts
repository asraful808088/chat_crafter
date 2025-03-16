import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import { createJsonFile, deleteJsonFile } from "~/util/json_read_write";
export default defineEventHandler(async (event) => {
  if (event.method != "PUT") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const body = await readBody(event);
    const targetPoint = body["item"];
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "synonyms",
      targetPoint,
      'regenerate'
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    parseData.sents = body["items"]
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items:  parseData.sents };
  } catch (error) {}

  return {};
});
