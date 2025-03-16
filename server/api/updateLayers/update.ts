import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "PUT") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

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
    let current_profile = null;

    if (body["entype"]) {
      parseData["profiles"] = parseData["profiles"].map((element, index) => {
        if (element.label == body["name"]) {
          current_profile = {
            ...element,
            en_network: body["layers"],
          };
          return {
            ...current_profile,
          };
        }
        return element;
      });
    } else {
      // parseData["profiles"] = parseData["profiles"].map((element, index) => {
      //   if (element.label == body["name"]) {
      //     current_profile = {
      //       ...element,
      //       network: body["layers"],
      //     };
      //     return {
      //       ...current_profile,
      //     };
      //   }
      //   return element;
      // });
    }

    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData["profiles"], active: current_profile };
  } catch (error) {}

  return {};
});
