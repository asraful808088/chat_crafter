import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "GET") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  let filepath = path.resolve(
    process.cwd(),
    "doc",
    botname,
    "profile",
    "profile.json"
  );
  try {
    const readFile = fs.readFileSync(`${filepath}`, "utf-8");
    const parseData = JSON.parse(readFile);
    return {
      items: parseData.profiles,
    };
  } catch (error) {
  }

  return {};
});
