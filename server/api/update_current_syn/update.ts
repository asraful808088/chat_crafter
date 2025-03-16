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
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "synonyms",
      body["id"],
      body.main_word
    );

    const data = fs.readFileSync(`${filePath}_alterdemo_.json`, "utf-8");
    const parseData = JSON.parse(data);
    parseData.generate = [...new Set(body?.generate ?? [])];
    fs.writeFileSync(`${filePath}_alterdemo_.json`, JSON.stringify(parseData));
    return { items: parseData.generate };
  } catch (error) {
    console.log(error);
  }

  return {};
});
