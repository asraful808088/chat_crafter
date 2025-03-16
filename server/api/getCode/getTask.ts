import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";

export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const body = await readBody(event);
  try {
    const readFile = fs.readFileSync(`${path.resolve(
        process.cwd(),
        "doc",
        botname,
        body["of"]??"condition",
        body["item_name"],
        body["name"]
      )}`, "utf-8");

    return { file: {
        code:readFile
    } };
  } catch (error) {
    console.log(error)
  }

  return {};
});
