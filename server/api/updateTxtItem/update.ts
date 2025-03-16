import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
/**
 *
 *
 * allAlter
 * addAlter
 * removeAlter
 *
 *
 *
 */
export default defineEventHandler(async (event) => {
  if (event.method != "PUT") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const body = await readBody(event);
  const entitiesName = body["item"];

    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      body["of"],
      entitiesName,
      entitiesName
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    if (body["change"] == "allAlter") {
      let newlist_of_intent = parseData.list_of_intent.map((element, index) => {
        if (element.mainsent == body["sent"]) {
          return {
            ...element,
            allAlter: body["currectStatus"],
          };
        }
        return element;
      });
      parseData.list_of_intent = newlist_of_intent;
    }else if (body["change"] == "addAlter") {
      let newlist_of_intent = parseData.list_of_intent.map((element, index) => {
        if (element.mainsent == body["sent"]) {
          return {
            ...element,
            alter: [...element.alter, body["add"]],
          };
        }
        return element;
      });
      parseData.list_of_intent = newlist_of_intent;

    }if (body["change"] == "removeAlter"){
      let newlist_of_intent = parseData.list_of_intent.map((element, index) => {
        if (element.mainsent == body["sent"]) {
          return {
            ...element,
            alter: [...new Set([...element.alter.filter((element)=>element!=body["add"]) ])],
          };
        }
        return element;
      });
      parseData.list_of_intent = newlist_of_intent;
    }
    

    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData.list_of_intent };
  } catch (error) {
    return {};
  }

  return {};
});
