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
    const findword = Object.keys(parseData).find(
      (element) => element == body["name"]
    );
    if (findword) {
      return {
        data: parseData,
      };
    }

    if (body["syn"]) {
      parseData[body["name"]] = {};
    } else {
      parseData[body["name"]] = [];
    }

    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { data: parseData };
  } catch (error) {
    console.log(error);
    return {};
  }

  return {};
});
