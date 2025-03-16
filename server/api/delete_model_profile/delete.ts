import fs from "fs";
import path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const body = getQuery(event);
  try {
    const deleteProfile = body["delete"];
    if (!deleteProfile) {
      throw "name empty";
    }
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "profile",
      "profile"
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    const newItems = parseData.profiles.filter(
      (element) => element?.label != deleteProfile
    );
    parseData.profiles = newItems;
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData.profiles };
  } catch (error) {
    return {};
  }

  return {};
});
