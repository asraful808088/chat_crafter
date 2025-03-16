import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "GET") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const { id } = event.context.params;
  const query = getQuery(event);
  try {
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "synonyms",
      id,
      `${query["word"]}_alterdemo_`
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    return {
      item: parseData,
    };
  } catch (error) {}

  return {};
});
