import * as fs from "fs";
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
      path.resolve(process.cwd(), "doc", botname, body["of"])
    );
    const listOfIems = [];
    for (const element of fileitems) {
      try {
        const readFile = fs.readFileSync(
          path.resolve(
            process.cwd(),
            "doc",
            botname,
            body["of"],
            element,
            "details.json"
          ),
          "utf-8"
        );
        const parseData = JSON.parse(readFile);
        listOfIems.push({
          name: parseData["name"],
          task_list: parseData["task_list"],
          code:fs.readFileSync(
            path.resolve(
              process.cwd(),
              "doc",
              botname,
              body["of"],
              element,
              "code_runner.py"
            ),
            "utf-8"
          )
        });
      } catch (error) {
      }
    }

    return { items: listOfIems };
  } catch (error) {
  }

  return {};
})