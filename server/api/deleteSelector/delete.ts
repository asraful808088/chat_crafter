import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import deleteDirWithContents from "~/util/deleteFiles";
import readAllDirs from "~/util/readDir";
import * as fs from "fs";
export default defineEventHandler(async (event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const query = getQuery(event);
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      query["of"],
      query["name"]
    );
    deleteDirWithContents(
      path.resolve(process.cwd(), "doc", botname, query["of"], query["name"])
    );
    const fileitems = readAllDirs(
      path.resolve(process.cwd(), "doc", botname, query["of"])
    );

    const itemObj = []
        for (const element of fileitems) {
          const details  = fs.readFileSync(path.resolve(process.cwd(), "doc", botname, query["of"].replace("-","_"),element,'details.json'),'utf-8');
          const sitems  = fs.readFileSync(path.resolve(process.cwd(), "doc", botname, query["of"].replace("-","_"),element,`${element}.json`),'utf-8');
          itemObj.push({
            length:JSON.parse(sitems)['list_of_intent'].length,
            ...JSON.parse(details),
          })  
        }
    return { items: itemObj };
  } catch (error) {
    return {};
  }

  return {};
});
