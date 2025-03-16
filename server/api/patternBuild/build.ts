import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import { createJsonFile, deleteJsonFile } from "~/util/json_read_write";
import generate_word_alter from "~/util/word_generator";
export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
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
      body["item"],
      `${body["main_word"]}_alterdemo_.json`,
    );
    const generateItems = generate_word_alter({list_config:body["patternList"] },body["count"])
    const data = fs.readFileSync(`${filePath}`, "utf-8");
    const parseData = JSON.parse(data);
    parseData.generate = [...new Set([...parseData.generate,...new Set(generateItems)])]
    fs.writeFileSync(`${filePath}`, JSON.stringify(parseData, null, 2));
    return { items: parseData.generate };
  } catch (error) {}

  return {};
});
