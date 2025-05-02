import * as fs from "fs";
import { getQuery } from "h3";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";
import deleteDirWithContents from "~/util/deleteFiles";

export default defineEventHandler((event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  const query = getQuery(event);
//   query["of"]
  try {
    let filePath2 = path.resolve(
      process.cwd(),
      "doc",
      botname,
      query["of"],
      query["name"],
    );
    
    deleteDirWithContents(filePath2)
    const fileitems = readAllDirs(
        path.resolve(process.cwd(), "doc", botname, query["of"])
      );

      const listOfIems = [];
for (const element of fileitems) {
        try {
          const readFile = fs.readFileSync(
            path.resolve(
              process.cwd(),
              "doc",
              botname,
              query["of"],
              element,
              "details.json"
            ),
            "utf-8"
          );
          const parseData = JSON.parse(readFile);
          listOfIems.push({
            name: parseData["name"],
            task_list: parseData["task_list"],
            code:  query["of"] == "task"? fs.readFileSync(
              path.resolve(
                process.cwd(),
                "doc",
                botname,
                query["of"],
                element,
                "code_runners.py"
              ),
              "utf-8"
            ):fs.readFileSync(
              path.resolve(
                process.cwd(),
                "doc",
                botname,
                query["of"],
                element,
                "code_runner.py"
              ),
              "utf-8"
            ),
          });
        } catch (error) {}
      }














      return { items: listOfIems };




    
  } catch (error) {
    console.log(error)
    return {};
  }

  return {};
});
