import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
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
      body["of"],
      entitiesName,
      "alternative"
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    if (parseData[body["name"]]) {
      const wordlist = parseData[body["name"]].filter(
        (element) => element != body["alternative"]
      );
      parseData[body["name"]] = wordlist;

      fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));

      return { data: parseData };
    } else {
      return { data: parseData };
    }
  } catch (error) {
    return {};
  }

  return {};
});
