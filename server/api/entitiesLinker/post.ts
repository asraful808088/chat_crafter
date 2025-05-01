import * as fs from "fs";

import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import copyDirectory from "~/util/copy";
import checkAndCreateDir from "~/util/createDir";

export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const query = await readBody(event);
  const entitiesName = query["item"];
  const model_name = query["model_name"];
  const isLink = query["link"];

  try {
    // const parentDirPath = path.join(process.cwd(), "python", "entities",botname,entitiesName);
    if (isLink) {
      const parentDirPath = path.join(
        process.cwd(),
        "doc",
        botname,
        "entities_box",
        entitiesName
      );
      const model_nameDirPath = path.join(
        process.cwd(),
        "python",
        "entities",
        botname,
        entitiesName,
        model_name
      );
      const details = {
        name: entitiesName,
        des: `generative-model ${entitiesName}-${model_name}`,
        time: Date.now(),
        type: entitiesName,
        model:model_name
      };
      checkAndCreateDir(parentDirPath);
      copyDirectory(model_nameDirPath, parentDirPath);
      fs.writeFileSync(
        `${path.join(process.cwd(), "doc", botname, "entities_box", entitiesName, "details")}.json`,
        JSON.stringify({...details}, null, 2)
      );
      return {
        success: true,
      };
    } else {
    }

    // const parentDirForReadPath = path.join(process.cwd(), "python", "entities",botname);
    // deleteDirWithContents(parentDirPath)
    // const items = readAllDirs(parentDirForReadPath)
    // return { items: items };
  } catch (error) {
    return {};
  }

  return {};
});
