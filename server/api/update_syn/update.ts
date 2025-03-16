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
    if (body["remove"]) {
      try {
        for (const element of body["remove"]) {
          let tempFilepath = path.resolve(
            process.cwd(),
            "doc",
            botname,
            "synonyms",
            targetPoint,
            element?.main_word
          );
          deleteJsonFile(`${tempFilepath}_alterdemo_.json`);
        }
      } catch (error) {}
    }
    if (body["add"]) {
      try {
        for (const element of body["add"]) {
          let tempFilepath = path.resolve(
            process.cwd(),
            "doc",
            botname,
            "synonyms",
            targetPoint,
            element?.main_word
          );
          createJsonFile(
            `${tempFilepath}_alterdemo_.json`,
            { generate: [],main_word:element?.main_word }
          );
        }
      } catch (error) {}
    }
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "synonyms",
      targetPoint,
      targetPoint
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    parseData.list_of_intent = body["list"];
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData.list_of_intent };
  } catch (error) {}

  return {};
});
