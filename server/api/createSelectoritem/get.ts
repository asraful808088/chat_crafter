import fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";
export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const body = await readBody(event);
    const fileitems = readAllDirs(
      path.resolve(process.cwd(), "doc", botname, body["of"].replace("-", "_"))
    );
    const itemObj = [];
    for (const element of fileitems) {
      const details = fs.readFileSync(
        path.resolve(
          process.cwd(),
          "doc",
          botname,
          body["of"].replace("-", "_"),
          element,
          "details.json"
        ),
        "utf-8"
      );

      let sitems = null
      try {
        sitems = fs.readFileSync(
          path.resolve(
            process.cwd(),
            "doc",
            botname,
            body["of"].replace("-", "_"),
            element,
            `${element}.json`
          ),
          "utf-8"
        );
        itemObj.push({
          length: JSON.parse(sitems)["list_of_intent"].length,
          ...JSON.parse(details),
        });
      } catch (error) {
        
        itemObj.push({
          ...JSON.parse(details),
        });
      }
     
    }
    return { items: itemObj };
  } catch (error) {
    console.error("Error reading files:", error);
    return {};
  }

  return {};
});
