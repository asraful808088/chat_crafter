import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "PUT") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  //   const entitiesName = "test";

  try {
    const body = await readBody(event);
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "profile",
      "profile"
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    const targetProfileName = body["target"];
    const updateType = body["update_type"];
    const targetUpdateProperty = body["target_property"];
    const updateValue = body["value"];
    const is_network = body["is_network"];
    let currentModel = null;
    if (body["c_profile"]) {
    const obj   = parseData.profiles.find((element,index)=>element.label == targetProfileName)
    return {  active: obj };
        
    }
    parseData.profiles = parseData.profiles.map((element, index) => {
      if (element.label == targetProfileName) {
        if (!is_network) {
          if (updateType == 1) {
            element[targetUpdateProperty].active = updateValue;
          } else if (updateType == 2) {
            element[targetUpdateProperty].list = [
              updateValue,
              ...element[targetUpdateProperty].list,
            ];
          } else if (updateType == 3) {
            element[targetUpdateProperty].list = element[
              targetUpdateProperty
            ].list.filter((element2) => element2 != updateValue);
          }
        } else {
        }
        currentModel = element;
        return element;
      }
      return element;
    });

    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData.profiles, active: currentModel };
  } catch (error) {
    return {};
  }

  return {};
});
