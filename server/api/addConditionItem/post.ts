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
    const entitiesName = body["consdition"];
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "condition",
      entitiesName,
      "details.json"
    );
    const data = fs.readFileSync(`${filePath}`, "utf-8");
    const parseData = JSON.parse(data);
    parseData.use_list =  [...parseData?.use_list, body];
    fs.writeFileSync(`${filePath}`, JSON.stringify(parseData, null, 2));
  } catch (error) {
    return {};
  }

  return {};
});
