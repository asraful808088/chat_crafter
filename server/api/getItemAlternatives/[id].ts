import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "GET") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const entitiesName = "test";
  const { id } = event.context.params;
  const query = getQuery(event);
  try {
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      query["of"],
      entitiesName,
      entitiesName
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    const findSent = parseData?.list_of_intent?.find((element,index)=>element.mainsent==id)
    console.log(findSent?.alter)
  } catch (error) {}
  // console.log(query["of"]) id alter

  return {};
});
