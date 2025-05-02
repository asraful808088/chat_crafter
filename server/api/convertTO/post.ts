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
    let tobasePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      body["to"],
      body["to_name"]
    );
    let frombasePath = path.resolve(
        process.cwd(),
        "doc",
        botname,
        body["from"],
        body["from_name"]
      );

    const fromitemsdata = JSON.parse(fs.readFileSync(path.resolve(frombasePath,`${body["from_name"]}.json`),"utf-8"))
    // const fromdetailsdata = JSON.parse(fs.readFileSync(path.resolve(frombasePath,`details.json`),"utf-8"))
    // const fromalternativedata = JSON.parse(fs.readFileSync(path.resolve(frombasePath,`alternative.json`),"utf-8"))
    // const fromregeneratedata = JSON.parse(fs.readFileSync(path.resolve(frombasePath,`regenerate.json`),"utf-8"))


    const toitemsdata = JSON.parse(fs.readFileSync(path.resolve(tobasePath,`${body["to_name"]}.json`),"utf-8"))
    // const todetailsdata = JSON.parse(fs.readFileSync(path.resolve(tobasePath,`details.json`),"utf-8"))
    // const toalternativedata = JSON.parse(fs.readFileSync(path.resolve(tobasePath,`alternative.json`),"utf-8"))
    // const toregeneratedata = JSON.parse(fs.readFileSync(path.resolve(tobasePath,`regenerate.json`),"utf-8"))
    const newList   = toitemsdata["list_of_intent"]
    for (const element of fromitemsdata["list_of_intent"]) {
        const findItem = newList.find(element2=>element2.mainsent == element.mainsent )
            if (!findItem) {
                newList.push(element) 
            }
    }
    toitemsdata["list_of_intent"] = newList
    fs.writeFileSync(path.resolve(tobasePath,`${body["to_name"]}.json`), JSON.stringify(toitemsdata))
  } catch (error) {
    return {};
  }

  return {};
});
