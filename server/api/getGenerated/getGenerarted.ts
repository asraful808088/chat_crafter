import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const body = await readBody(event);
  console.log();
  console.log();
  console.log();
  console.log(body["item_id"]);
  try {
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      body["of"],
      body["id"],
      `regenerate`
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    let flutting = [];
    parseData?.sents?.forEach((ele) => {
      flutting = [...flutting, ...ele.list];
    });
    let filterItems = [];

    if (body["to"] == "prev") {
      const indexNo = flutting
        .map((element, index) => {
          if (element.id == body["item_id"]) {
            return index;
          }
          return null;
        })
        .filter((element) => element != null);

      if (indexNo[0] - 200 < 0) {
        if (flutting.length > indexNo[0] + 50) {
          filterItems = flutting.slice(0, indexNo[0] + 50);
        } else {
          filterItems = flutting.slice(0, flutting.length);
        }
      } else {
        if (flutting.length > indexNo[0] + 50) {
          filterItems = flutting.slice(indexNo[0] - 200, indexNo[0] + 50);
        } else {
          filterItems = flutting.slice(indexNo[0] - 200, flutting.length);
        }
      }
    } else {
      const indexNo = flutting
        .map((element, index) => {
          if (element.id == body["item_id"]) {
            return index;
          }
          return null;
        })
        .filter((element) => element != null);

      if (indexNo[0] - 50 < 0) {
        console.log("!@3123123");

        if (flutting.length > indexNo[0] + 200) {
          filterItems = flutting.slice(0, indexNo[0] + 200);
        } else {
          filterItems = flutting.slice(0, flutting.length);
        }
      } else {
        if (flutting.length > indexNo[0] + 200) {
          filterItems = flutting.slice(indexNo[0] - 50, indexNo[0] + 200);
        } else {
          filterItems = flutting.slice(indexNo[0] - 50, flutting.length);
        }
      }
    }
    return {
      item: filterItems,
    };
  } catch (error) {}

  return {};
});
