import * as fs from "fs";
import { getQuery } from "h3";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  const query = getQuery(event);
  try {
    let filePath2 = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "condition",
      query["name"],
      "details.json"
    );
    const data = fs.readFileSync(filePath2, "utf-8");
    const parseData2 = JSON.parse(data);
    parseData2.use_list = parseData2.use_list.filter((element) => !(element.consdition == query["name"] && element.condition_type == query["type"] &&  element.id == query["id"]));
    fs.writeFileSync(filePath2, JSON.stringify(parseData2, null, 2));
  } catch (error) {
    return {};
  }

  return {};
});
